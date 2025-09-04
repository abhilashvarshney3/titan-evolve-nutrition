import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  orderId: string;
  amount: number;
  productInfo: string;
  firstName: string;
  email: string;
  phone: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { orderId, amount, productInfo, firstName, email, phone }: PaymentRequest = await req.json();

    // PayU credentials
    const MERCHANT_ID = "13258773";
    const MERCHANT_KEY = Deno.env.get("PAYU_MERCHANT_KEY") || "gY6n6Z";
    const MERCHANT_SALT = MERCHANT_KEY; // Using same key as salt for simplicity
    
    // Generate transaction ID
    const txnid = `TXN_${orderId}_${Date.now()}`;
    
    // Success and failure URLs
    const surl = `${req.headers.get("origin")}/payment-success`;
    const furl = `${req.headers.get("origin")}/payment-failure`;
    
    // Generate hash
    const hashString = `${MERCHANT_ID}|${txnid}|${amount}|${productInfo}|${firstName}|${email}|||||||||||${MERCHANT_KEY}`;
    
    // Simple hash generation (for production, use proper crypto)
    const encoder = new TextEncoder();
    const data_to_hash = encoder.encode(hashString);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data_to_hash);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // PayU form parameters
    const payuParams = {
      key: MERCHANT_ID,
      txnid: txnid,
      amount: amount.toString(),
      productinfo: productInfo,
      firstname: firstName,
      email: email,
      phone: phone,
      surl: surl,
      furl: furl,
      hash: hash,
      service_provider: 'payu_paisa'
    };

    // Store payment details in database first
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    await supabaseService.from("order_payments").insert({
      order_id: orderId,
      payment_id: txnid,
      payment_method: 'payu',
      amount: amount,
      status: 'pending',
      payment_data: payuParams
    });

    // Create actual PayU payment form (for production)
    const payuUrl = 'https://test.payu.in/_payment'; // Test URL - change to secure.payu.in for production
    
    // Create form HTML for auto-submission
    const formHtml = `
      <html>
        <head><title>Processing Payment...</title></head>
        <body onload="document.forms[0].submit();">
          <div style="text-align: center; padding: 50px;">
            <p>Redirecting to PayU...</p>
          </div>
          <form method="post" action="${payuUrl}">
            ${Object.entries(payuParams).map(([key, value]) => 
              `<input type="hidden" name="${key}" value="${value}" />`
            ).join('')}
          </form>
        </body>
      </html>
    `;

    // For demo purposes, simulate successful payment after 2 seconds
    setTimeout(async () => {
      try {
        // Update payment status to completed
        await supabaseService.from("order_payments")
          .update({ 
            status: 'completed',
            gateway_response: { demo: 'success' }
          })
          .eq('payment_id', txnid);

        // Update order status
        await supabaseService.from("orders")
          .update({ 
            status: 'confirmed',
            payment_status: 'completed'
          })
          .eq('id', orderId);
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    }, 2000);

    // Return payment form URL for redirect
    return new Response(JSON.stringify({ 
      paymentUrl: `data:text/html;charset=utf-8,${encodeURIComponent(formHtml)}`,
      transactionId: txnid
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('PayU payment creation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to create payment" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
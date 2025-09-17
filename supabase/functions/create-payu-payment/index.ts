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

    // PayU Production Credentials
    const MERCHANT_KEY = Deno.env.get("PAYU_MERCHANT_KEY");
    const MERCHANT_SALT = Deno.env.get("PAYU_SALT");
    
    if (!MERCHANT_KEY || !MERCHANT_SALT) {
      throw new Error("PayU credentials not configured");
    }

    console.log('PayU Merchant Key length:', MERCHANT_KEY.length);
    console.log('PayU Salt length:', MERCHANT_SALT.length);
    
    // Generate unique transaction ID
    const txnid = `TXN_${orderId}_${Date.now()}`;
    
    // Success and failure URLs - Use main website domain
    const baseUrl = req.headers.get("origin") || "https://titanevolvenutrition.com";
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    
    // PayU callbacks should go to your main domain, not Supabase domain
    const surl = `${baseUrl}/api/payu-callback`;
    const furl = `${baseUrl}/api/payu-callback`;
    
    // PayU requires specific parameters in exact order for hash generation
    const hashString = `${MERCHANT_KEY}|${txnid}|${amount}|${productInfo}|${firstName}|${email}|||||||||||${MERCHANT_SALT}`;
    
    // Generate SHA-512 hash
    const encoder = new TextEncoder();
    const data_to_hash = encoder.encode(hashString);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data_to_hash);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    console.log('PayU Hash String (without salt):', hashString.replace(MERCHANT_SALT, 'SALT_HIDDEN'));
    console.log('Generated Hash Length:', hash.length);
    console.log('Hash starts with:', hash.substring(0, 10));

    // PayU form parameters
    const payuParams = {
      key: MERCHANT_KEY,
      txnid: txnid,
      amount: amount.toString(),
      productinfo: productInfo,
      firstname: firstName,
      email: email,
      phone: phone,
      surl: surl,
      furl: furl,
      hash: hash
    };

    // Store payment details in database
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

    // PayU Production URL
    const payuUrl = 'https://secure.payu.in/_payment';
    
    // Create HTML form that auto-submits to PayU
    const formHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Redirecting to PayU...</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .container {
              background: white;
              padding: 3rem;
              border-radius: 15px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              text-align: center;
              max-width: 400px;
              width: 90%;
            }
            .spinner {
              border: 4px solid #f3f3f3;
              border-radius: 50%;
              border-top: 4px solid #667eea;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 20px auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            h2 { color: #333; margin-bottom: 20px; }
            p { color: #666; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Processing Payment</h2>
            <div class="spinner"></div>
            <p>Please wait while we redirect you to PayU secure payment gateway...</p>
          </div>
          <form id="payuForm" method="post" action="${payuUrl}">
            ${Object.entries(payuParams).map(([key, value]) => 
              `<input type="hidden" name="${key}" value="${value}" />`
            ).join('')}
          </form>
          
          <script>
            // Auto-submit form after 2 seconds
            setTimeout(function() {
              document.getElementById('payuForm').submit();
            }, 2000);
          </script>
        </body>
      </html>
    `;

    // Return HTML response that redirects to PayU
    return new Response(formHtml, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/html; charset=utf-8",
      },
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
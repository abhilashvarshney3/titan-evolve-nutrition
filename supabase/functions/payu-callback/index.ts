import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PayUCallback {
  status: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  hash: string;
  PG_TYPE: string;
  bank_ref_num?: string;
  bankcode?: string;
  error?: string;
  error_Message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('PayU Callback received:', req.method);
    
    // Initialize Supabase client with service role
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    let payuData: PayUCallback;
    
    if (req.method === 'POST') {
      const formData = await req.formData();
      payuData = Object.fromEntries(formData.entries()) as any;
    } else {
      // Handle GET request with query params
      const url = new URL(req.url);
      payuData = Object.fromEntries(url.searchParams.entries()) as any;
    }

    console.log('PayU Response Data:', payuData);

    const { status, txnid, amount, error, error_Message } = payuData;

    if (!txnid) {
      throw new Error('Transaction ID not found in callback');
    }

    // Update payment record
    const { data: paymentData, error: paymentError } = await supabaseService
      .from('order_payments')
      .update({
        status: status === 'success' ? 'completed' : 'failed',
        gateway_response: payuData,
        updated_at: new Date().toISOString()
      })
      .eq('payment_id', txnid)
      .select('order_id')
      .single();

    if (paymentError) {
      console.error('Payment update error:', paymentError);
      throw paymentError;
    }

    if (!paymentData) {
      throw new Error('Payment record not found for transaction ID: ' + txnid);
    }

    // Update order status based on payment status
    const orderStatus = status === 'success' ? 'confirmed' : 'payment_failed';
    const paymentStatus = status === 'success' ? 'completed' : 'failed';

    const { error: orderError } = await supabaseService
      .from('orders')
      .update({
        status: orderStatus as any,
        payment_status: paymentStatus as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentData.order_id);

    if (orderError) {
      console.error('Order update error:', orderError);
      throw orderError;
    }

    console.log(`Order ${paymentData.order_id} updated with status: ${orderStatus}, payment: ${paymentStatus}`);

    // Redirect based on payment status
    const baseUrl = req.headers.get("origin") || "https://titanevolvenutrition.com";
    
    if (status === 'success') {
      const redirectUrl = `${baseUrl}/payment-success?txnid=${txnid}&status=success&orderId=${paymentData.order_id}&method=online`;
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': redirectUrl
        }
      });
    } else {
      const errorMsg = error_Message || error || 'Payment failed';
      const redirectUrl = `${baseUrl}/payment-failure?txnid=${txnid}&status=failed&error=${encodeURIComponent(errorMsg)}&orderId=${paymentData.order_id}`;
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': redirectUrl
        }
      });
    }

  } catch (error) {
    console.error('PayU callback error:', error);
    
    // Redirect to failure page on error
    const baseUrl = req.headers.get("origin") || "https://titanevolvenutrition.com";
    const redirectUrl = `${baseUrl}/payment-failure?error=${encodeURIComponent(error.message)}`;
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl
      }
    });
  }
});
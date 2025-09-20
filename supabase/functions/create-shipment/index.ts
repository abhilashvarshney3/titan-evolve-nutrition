import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// I Carry API Configuration (Dummy - Replace with actual values)
const ICARRY_CONFIG = {
  apiUrl: 'https://www.icarry.in/api_login', // Replace with actual I Carry API URL
  apiKey: 'ela31436', // Add this to Supabase secrets
  apiSecret: 'Ds7JGqX1U1jnSqBX7LH28tMfjSOBjhdxDi7uK5bPqAqZMo6KW6F5HEf4MYQQj8GwTvODL2brinXOHCfJNrhonXhdDb5ZgRcb26CV6USiODVOEu0YUZJ4s8A6eZWR9fI1rpg27FstJmT7dQLpCpLPlpTvaHqEVf3NhdJSWRtxLzYLs1GCBPg2IHtod8lNwS7J1XmhGysgNYO9ib7qS37oh1Q6FfV6Bd0M6aUbmDfy6Gg1jcQ30gsc8vx9Y8YMKiAT' // Add this to Supabase secrets
};

interface ShipmentRequest {
  orderId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { orderId }: ShipmentRequest = await req.json();

    // Fetch order details
    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          variant_id,
          quantity,
          price,
          product:products(name, image_url),
          variant:product_variants(variant_name, size, flavor)
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    // Calculate package weight and dimensions (dummy calculation)
    const totalItems = order.order_items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const estimatedWeight = totalItems * 0.5; // 0.5 kg per item (dummy)
    const dimensions = {
      length: Math.max(20, totalItems * 5), // cm
      width: Math.max(15, totalItems * 3),  // cm
      height: Math.max(10, totalItems * 2)  // cm
    };

    // Prepare shipment data for I Carry API (dummy structure)
    const shipmentData = {
      orderId: order.id,
      pickupAddress: {
        name: "Your Store Name",
        address: "Store Address Line 1",
        city: "Store City",
        state: "Store State",
        pincode: "123456",
        phone: "9999999999"
      },
      deliveryAddress: order.shipping_address,
      weight: estimatedWeight,
      dimensions: dimensions,
      items: order.order_items.map((item: any) => ({
        name: item.product.name,
        quantity: item.quantity,
        value: item.price
      })),
      declaredValue: order.total_amount,
      codAmount: 0, // Since payment is already done
      serviceType: "standard"
    };

    // TODO: Make actual API call to I Carry
    // For now, we'll create a dummy shipment record
    
    /*
    // Uncomment and modify when you have actual I Carry credentials
    const icarryResponse = await fetch(`${ICARRY_CONFIG.apiUrl}/shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('ICARRY_API_KEY')}`,
        'X-API-Secret': Deno.env.get('ICARRY_API_SECRET') || ''
      },
      body: JSON.stringify(shipmentData)
    });

    if (!icarryResponse.ok) {
      throw new Error('Failed to create shipment with I Carry');
    }

    const icarryData = await icarryResponse.json();
    */

    // Create dummy shipment data (replace with actual I Carry response)
    const dummyShipmentResponse = {
      shipmentId: `IC${Date.now()}`,
      trackingNumber: `TRK${orderId.slice(0, 8)}${Date.now()}`,
      status: 'pickup_scheduled',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
    };

    // Create shipment record in database
    const { data: shipment, error: shipmentError } = await supabaseService
      .from('shipments')
      .insert({
        order_id: orderId,
        shipment_id: dummyShipmentResponse.shipmentId,
        tracking_number: dummyShipmentResponse.trackingNumber,
        status: dummyShipmentResponse.status,
        pickup_address: shipmentData.pickupAddress,
        delivery_address: shipmentData.deliveryAddress,
        weight: estimatedWeight,
        dimensions: dimensions,
        estimated_delivery: dummyShipmentResponse.estimatedDelivery,
        shipment_data: shipmentData
      })
      .select()
      .single();

    if (shipmentError) throw shipmentError;

    // Update order status
    await supabaseService
      .from('orders')
      .update({
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    // Create order tracking entry
    await supabaseService
      .from('order_tracking')
      .insert({
        order_id: orderId,
        status: 'Shipment Created',
        message: `Your order has been confirmed and shipment has been created. Tracking number: ${dummyShipmentResponse.trackingNumber}`,
        tracking_number: dummyShipmentResponse.trackingNumber,
        carrier: 'I Carry',
        estimated_delivery: dummyShipmentResponse.estimatedDelivery
      });

    console.log('Shipment created successfully:', shipment);

    return new Response(JSON.stringify({ 
      success: true,
      shipment: shipment,
      message: 'Shipment created successfully'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Shipment creation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to create shipment" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

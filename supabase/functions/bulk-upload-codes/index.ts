import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BulkUploadRequest {
  codes: string[];
  uploadId: string;
  productId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { codes, uploadId, productId }: BulkUploadRequest = await req.json();

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid codes array" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Processing ${codes.length} codes for upload ${uploadId}`);

    // Update upload status to processing
    await supabaseClient
      .from('code_uploads')
      .update({ 
        status: 'processing',
        total_codes: codes.length 
      })
      .eq('id', uploadId);

    let uploadedCount = 0;
    let failedCount = 0;
    const failedCodes = [];
    const batchSize = 100; // Process in batches to avoid timeouts

    for (let i = 0; i < codes.length; i += batchSize) {
      const batch = codes.slice(i, i + batchSize);
      
      // Prepare batch data
      const batchData = batch.map(code => ({
        code: code.trim().toUpperCase(),
        product_id: productId || null,
        is_used: false,
        created_at: new Date().toISOString()
      }));

      try {
        // Insert batch
        const { data, error } = await supabaseClient
          .from('verification_codes')
          .insert(batchData)
          .select('code');

        if (error) {
          console.error(`Batch error:`, error);
          failedCount += batch.length;
          failedCodes.push(...batch.map(code => ({ code, error: error.message })));
        } else {
          uploadedCount += data?.length || 0;
        }

        // Update progress
        await supabaseClient
          .from('code_uploads')
          .update({ 
            uploaded_codes: uploadedCount,
            failed_codes: failedCount
          })
          .eq('id', uploadId);

      } catch (batchError) {
        console.error(`Batch processing error:`, batchError);
        failedCount += batch.length;
        failedCodes.push(...batch.map(code => ({ code, error: 'Processing error' })));
      }
    }

    // Update final status
    const finalStatus = failedCount === 0 ? 'completed' : 'completed_with_errors';
    await supabaseClient
      .from('code_uploads')
      .update({ 
        status: finalStatus,
        uploaded_codes: uploadedCount,
        failed_codes: failedCount,
        completed_at: new Date().toISOString(),
        error_log: failedCodes.length > 0 ? { failed_codes: failedCodes } : null
      })
      .eq('id', uploadId);

    console.log(`Upload ${uploadId} completed: ${uploadedCount} uploaded, ${failedCount} failed`);

    return new Response(JSON.stringify({ 
      success: true,
      uploadedCount,
      failedCount,
      status: finalStatus
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in bulk-upload-codes function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
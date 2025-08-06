import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UploadStatus {
  id: string;
  filename: string;
  total_codes: number;
  uploaded_codes: number;
  failed_codes: number;
  status: string;
  created_at: string;
  completed_at?: string;
}

const CodeUploadSection = () => {
  const [codesText, setCodesText] = useState('');
  const [productId, setProductId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<UploadStatus[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchUploadHistory();
    
    // Set up real-time subscription for upload status updates
    const channel = supabase
      .channel('code-uploads')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'code_uploads' },
        () => {
          fetchUploadHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUploadHistory = async () => {
    const { data, error } = await supabase
      .from('code_uploads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setUploadHistory(data);
    }
  };

  const processTextCodes = () => {
    if (!codesText.trim()) {
      toast({
        title: "No codes provided",
        description: "Please enter some verification codes",
        variant: "destructive"
      });
      return;
    }

    const codes = codesText
      .split(/[\n,\s]+/)
      .map(code => code.trim())
      .filter(code => code.length > 0);

    if (codes.length === 0) {
      toast({
        title: "No valid codes",
        description: "Please provide valid verification codes",
        variant: "destructive"
      });
      return;
    }

    uploadCodes(codes, `text-upload-${Date.now()}.txt`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const codes = content
        .split(/[\n,\s]+/)
        .map(code => code.trim())
        .filter(code => code.length > 0);

      if (codes.length === 0) {
        toast({
          title: "No valid codes in file",
          description: "The file doesn't contain valid verification codes",
          variant: "destructive"
        });
        return;
      }

      uploadCodes(codes, file.name);
    };
    reader.readAsText(file);
  };

  const uploadCodes = async (codes: string[], filename: string) => {
    if (uploading) return;

    setUploading(true);
    try {
      // Create upload record
      const { data: uploadRecord, error: uploadError } = await supabase
        .from('code_uploads')
        .insert({
          filename,
          total_codes: codes.length,
          status: 'pending'
        })
        .select()
        .single();

      if (uploadError) throw uploadError;

      // Call edge function to process codes
      const { data, error } = await supabase.functions.invoke('bulk-upload-codes', {
        body: {
          codes,
          uploadId: uploadRecord.id,
          productId: productId || null
        }
      });

      if (error) throw error;

      toast({
        title: "Upload started",
        description: `Processing ${codes.length} verification codes. Check the upload history for progress.`
      });

      setCodesText('');
      setProductId('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload codes",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed_with_errors':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Verification Codes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Product ID (Optional)
            </label>
            <Input
              placeholder="Enter product ID to associate codes with a specific product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Method 1: Paste Codes
            </label>
            <Textarea
              placeholder="Paste your verification codes here (one per line, or separated by commas/spaces)"
              value={codesText}
              onChange={(e) => setCodesText(e.target.value)}
              rows={6}
              className="font-mono"
            />
            <Button 
              onClick={processTextCodes}
              disabled={uploading || !codesText.trim()}
              className="mt-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Codes
                </>
              )}
            </Button>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium mb-2">
              Upload Method 2: File Upload
            </label>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Accepts .txt or .csv files with codes separated by lines, commas, or spaces
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
        </CardHeader>
        <CardContent>
          {uploadHistory.length === 0 ? (
            <p className="text-gray-500">No uploads yet</p>
          ) : (
            <div className="space-y-3">
              {uploadHistory.map((upload) => (
                <div key={upload.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(upload.status)}
                      <span className="font-medium">{upload.filename}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(upload.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <div className="grid grid-cols-3 gap-4">
                      <div>Total: {upload.total_codes}</div>
                      <div className="text-green-600">Uploaded: {upload.uploaded_codes}</div>
                      <div className="text-red-600">Failed: {upload.failed_codes}</div>
                    </div>
                    <div className="mt-1">
                      Status: <span className="capitalize">{upload.status.replace('_', ' ')}</span>
                      {upload.completed_at && (
                        <span className="ml-2">
                          (Completed: {new Date(upload.completed_at).toLocaleString()})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeUploadSection;
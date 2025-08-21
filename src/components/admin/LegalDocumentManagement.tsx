import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Download, FileText, Trash2 } from 'lucide-react';

interface LegalDocument {
  name: string;
  url: string;
  uploadedAt: string;
  size: number;
}

const LegalDocumentManagement = () => {
  const [documents, setDocuments] = useState<{
    terms: LegalDocument | null;
    privacy: LegalDocument | null;
  }>({
    terms: null,
    privacy: null
  });
  const [uploading, setUploading] = useState<{ terms: boolean; privacy: boolean }>({
    terms: false,
    privacy: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const { data: files, error } = await supabase.storage
        .from('legal-documents')
        .list('', { limit: 100 });

      if (error) throw error;

      const termsFile = files?.find(file => file.name.startsWith('terms-and-conditions'));
      const privacyFile = files?.find(file => file.name.startsWith('privacy-policy'));

      const loadedDocs = {
        terms: null as LegalDocument | null,
        privacy: null as LegalDocument | null
      };

      if (termsFile) {
        const { data: { publicUrl } } = supabase.storage
          .from('legal-documents')
          .getPublicUrl(termsFile.name);
        
        loadedDocs.terms = {
          name: termsFile.name,
          url: publicUrl,
          uploadedAt: termsFile.created_at || '',
          size: termsFile.metadata?.size || 0
        };
      }

      if (privacyFile) {
        const { data: { publicUrl } } = supabase.storage
          .from('legal-documents')
          .getPublicUrl(privacyFile.name);
        
        loadedDocs.privacy = {
          name: privacyFile.name,
          url: publicUrl,
          uploadedAt: privacyFile.created_at || '',
          size: privacyFile.metadata?.size || 0
        };
      }

      setDocuments(loadedDocs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Error",
        description: "Failed to load legal documents",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (file: File, type: 'terms' | 'privacy') => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file only",
        variant: "destructive"
      });
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));

    try {
      const fileName = `${type === 'terms' ? 'terms-and-conditions' : 'privacy-policy'}-${Date.now()}.pdf`;

      // Delete existing file if it exists
      if (documents[type]) {
        await supabase.storage
          .from('legal-documents')
          .remove([documents[type]!.name]);
      }

      const { error: uploadError } = await supabase.storage
        .from('legal-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      toast({
        title: "Success",
        description: `${type === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'} uploaded successfully`
      });

      loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${type === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}`,
        variant: "destructive"
      });
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDeleteDocument = async (type: 'terms' | 'privacy') => {
    if (!documents[type]) return;

    if (!confirm(`Are you sure you want to delete the ${type === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'} document?`)) {
      return;
    }

    try {
      const { error } = await supabase.storage
        .from('legal-documents')
        .remove([documents[type]!.name]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${type === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'} deleted successfully`
      });

      setDocuments(prev => ({ ...prev, [type]: null }));
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Delete Failed",
        description: `Failed to delete ${type === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}`,
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Legal Document Management</h2>
        <p className="text-muted-foreground">Upload and manage Terms & Conditions and Privacy Policy PDF documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Terms and Conditions */}
        <Card className="bg-card text-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Terms & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.terms ? (
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium text-sm">{documents.terms.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Size: {formatFileSize(documents.terms.size)} • 
                    Uploaded: {new Date(documents.terms.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(documents.terms!.url, '_blank')}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteDocument('terms')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">No Terms & Conditions document uploaded</p>
              </div>
            )}
            
            <div>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'terms');
                }}
                className="hidden"
                id="terms-upload"
              />
              <Button
                onClick={() => document.getElementById('terms-upload')?.click()}
                disabled={uploading.terms}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading.terms ? 'Uploading...' : documents.terms ? 'Replace Document' : 'Upload Document'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card className="bg-card text-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.privacy ? (
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium text-sm">{documents.privacy.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Size: {formatFileSize(documents.privacy.size)} • 
                    Uploaded: {new Date(documents.privacy.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(documents.privacy!.url, '_blank')}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteDocument('privacy')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">No Privacy Policy document uploaded</p>
              </div>
            )}
            
            <div>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'privacy');
                }}
                className="hidden"
                id="privacy-upload"
              />
              <Button
                onClick={() => document.getElementById('privacy-upload')?.click()}
                disabled={uploading.privacy}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading.privacy ? 'Uploading...' : documents.privacy ? 'Replace Document' : 'Upload Document'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card text-foreground">
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Upload PDF documents for Terms & Conditions and Privacy Policy</p>
            <p>• Documents will be publicly accessible for users to download</p>
            <p>• Users will see these documents linked in the signup form</p>
            <p>• Only PDF files are accepted for legal documents</p>
            <p>• Uploading a new document will replace the existing one</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalDocumentManagement;
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LegalPDFViewerProps {
  documentType: 'terms' | 'privacy';
}

const LegalPDFViewer: React.FC<LegalPDFViewerProps> = ({ documentType }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDFUrl = async () => {
      try {
        const fileName = documentType === 'terms' ? 'terms-and-conditions.pdf' : 'privacy-policy.pdf';
        
        const { data } = supabase.storage
          .from('legal-documents')
          .getPublicUrl(fileName);

        if (data?.publicUrl) {
          // Check if file exists by trying to fetch it
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          if (response.ok) {
            setPdfUrl(data.publicUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching PDF:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPDFUrl();
  }, [documentType]);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!pdfUrl) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400">Document not found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0"
        title={documentType === 'terms' ? 'Terms and Conditions' : 'Privacy Policy'}
      />
    </div>
  );
};

export default LegalPDFViewer;
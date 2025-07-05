
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const Verify = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<'pending' | 'success' | 'failure' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [reportData, setReportData] = useState({
    retailer: '',
    purchaseDate: ''
  });
  const { toast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult('pending');

    try {
      // Check if code exists in database
      const { data, error } = await supabase
        .from('verification_codes')
        .select('*, products(*)')
        .eq('code', verificationCode.toUpperCase())
        .single();

      if (error || !data) {
        setVerificationResult('failure');
      } else if (data.is_used) {
        setVerificationResult('failure');
        toast({
          title: "Code Already Used",
          description: "This verification code has already been used.",
          variant: "destructive"
        });
      } else {
        // Mark code as used
        await supabase
          .from('verification_codes')
          .update({ is_used: true })
          .eq('id', data.id);
        
        setVerificationResult('success');
        toast({
          title: "Product Verified!",
          description: "Your product is authentic and genuine."
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult('failure');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Report Submitted",
      description: "Thank you for reporting. We'll investigate this matter."
    });
    // Here you would typically send the report to your backend
  };

  const resetVerification = () => {
    setVerificationCode('');
    setVerificationResult(null);
    setReportData({ retailer: '', purchaseDate: '' });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Verification Form */}
          <div className="bg-gray-900 p-8 rounded-xl border border-purple-800/30">
            <div className="text-center mb-8">
              <Shield className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h1 className="text-3xl font-black text-white mb-2">PRODUCT VERIFICATION</h1>
              <p className="text-gray-400">Enter the 7-digit code from your product</p>
            </div>

            {verificationResult === null && (
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Verification Code
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter 7-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                    className="bg-black border-purple-700 text-white rounded-lg h-12 text-center text-xl font-mono tracking-widest"
                    maxLength={7}
                    required
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    Find this code on your product packaging
                  </p>
                </div>

                <Button 
                  type="submit"
                  disabled={isVerifying || verificationCode.length !== 7}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
                >
                  {isVerifying ? 'VERIFYING...' : 'VERIFY PRODUCT'}
                </Button>
              </form>
            )}

            {verificationResult === 'pending' && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-300">Verifying your product...</p>
              </div>
            )}

            {verificationResult === 'success' && (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="h-20 w-20 text-green-400 mx-auto" />
                <h2 className="text-2xl font-bold text-green-400">AUTHENTIC PRODUCT</h2>
                <p className="text-gray-300">
                  Congratulations! Your product is genuine and has passed our authenticity verification.
                </p>
                <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 mt-4">
                  <p className="text-green-300 text-sm">
                    Thank you for choosing TITAN EVOLVE. Your trust in our products drives us to maintain the highest quality standards.
                  </p>
                </div>
                <Button 
                  onClick={resetVerification}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold mt-4"
                >
                  VERIFY ANOTHER PRODUCT
                </Button>
              </div>
            )}

            {verificationResult === 'failure' && (
              <div className="text-center py-8 space-y-4">
                <XCircle className="h-20 w-20 text-red-400 mx-auto" />
                <h2 className="text-2xl font-bold text-red-400">VERIFICATION FAILED</h2>
                <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-red-300 font-semibold mb-2">Invalid Code Detected</p>
                      <p className="text-gray-300 text-sm">
                        The code you entered does not match our records. This could indicate a counterfeit product.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <h3 className="text-white font-bold">Contact the Seller</h3>
                  <p className="text-gray-400 text-sm">
                    Please contact the retailer where you purchased this product immediately.
                  </p>
                  <form onSubmit={handleReport} className="bg-gray-800 rounded-lg p-4 space-y-3">
                    <Input
                      placeholder="Retailer/Store Name"
                      value={reportData.retailer}
                      onChange={(e) => setReportData({...reportData, retailer: e.target.value})}
                      className="bg-black border-purple-700 text-white rounded-lg"
                      required
                    />
                    <Input
                      placeholder="Purchase Date"
                      type="date"
                      value={reportData.purchaseDate}
                      onChange={(e) => setReportData({...reportData, purchaseDate: e.target.value})}
                      className="bg-black border-purple-700 text-white rounded-lg"
                      required
                    />
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
                      REPORT COUNTERFEIT
                    </Button>
                  </form>
                </div>
                
                <Button 
                  onClick={resetVerification}
                  variant="outline"
                  className="border-purple-600 text-white hover:bg-purple-800 mt-4"
                >
                  TRY AGAIN
                </Button>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link to="/" className="text-purple-400 hover:text-purple-300 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Verify;

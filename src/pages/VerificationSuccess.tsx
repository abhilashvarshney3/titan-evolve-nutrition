import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

const VerificationSuccess = () => {
  const { user } = useAuth();

  useEffect(() => {
    // If user is already authenticated and on verification success page,
    // they've successfully verified their email
    if (user) {
      console.log('Email verification successful for user:', user.email);
    }
  }, [user]);

  const handleRedirectToLogin = () => {
    window.location.href = 'https://titanevolvenutrition.com/login';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-8 p-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="bg-green-600 rounded-full p-4">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-green-400">
              EMAIL VERIFIED!
            </h1>
            <p className="text-xl text-gray-300">
              Your email has been successfully verified.
            </p>
            <p className="text-gray-400">
              You can now access your account and enjoy all the features of Titan Evolve.
            </p>
          </div>

          {/* Action Button */}
          <div className="space-y-4">
            <Button
              onClick={handleRedirectToLogin}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 text-lg"
              size="lg"
            >
              Continue to Login
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
            
            <p className="text-sm text-gray-500">
              You will be redirected to titanevolvenutrition.com
            </p>
          </div>

          {/* Branding */}
          <div className="pt-8 border-t border-purple-800/30">
            <div className="flex items-center justify-center space-x-2">
              <img 
                src="/lovable-uploads/LOGO.png" 
                alt="Titan Evolve Logo" 
                className="h-8 w-8 object-contain"
              />
              <div className="text-xl font-black tracking-wider">
                <span className="text-purple-400">TITAN</span>EVOLVE
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Premium Nutrition Supplements
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerificationSuccess;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Smartphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import OTPLogin from '@/components/OTPLogin';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupMethod, setSignupMethod] = useState<'email' | 'otp'>('email');
  const [legalDocs, setLegalDocs] = useState<{
    terms: string | null;
    privacy: string | null;
  }>({
    terms: null,
    privacy: null
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadLegalDocuments();
  }, []);

  const loadLegalDocuments = async () => {
    try {
      const { data: files, error } = await supabase.storage
        .from('legal-documents')
        .list('', { limit: 100 });

      if (error) throw error;

      const termsFile = files?.find(file => file.name.startsWith('terms-and-conditions'));
      const privacyFile = files?.find(file => file.name.startsWith('privacy-policy'));

      let termsUrl = null;
      let privacyUrl = null;

      if (termsFile) {
        const { data: { publicUrl } } = supabase.storage
          .from('legal-documents')
          .getPublicUrl(termsFile.name);
        termsUrl = publicUrl;
      }

      if (privacyFile) {
        const { data: { publicUrl } } = supabase.storage
          .from('legal-documents')
          .getPublicUrl(privacyFile.name);
        privacyUrl = publicUrl;
      }

      setLegalDocs({ terms: termsUrl, privacy: privacyUrl });
    } catch (error) {
      console.error('Error loading legal documents:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the Terms & Conditions and Privacy Policy to continue.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName
      });
      
      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account."
        });
        navigate('/login');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="text-4xl font-black text-white tracking-tight">
              <span className="text-purple-600">TITAN</span> EVOLVE
            </div>
          </Link>
        </div>

        {/* Signup Form */}
        <div className="bg-gray-900 p-8 rounded-xl border border-purple-800/30">
          {signupMethod === 'email' ? (
            <>
              <h1 className="text-3xl font-black text-center mb-2 text-white">JOIN THE EVOLUTION</h1>
              <p className="text-gray-400 text-center mb-8">Create your account</p>

              <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="bg-black border-purple-700 text-white rounded-lg h-12"
                required
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="bg-black border-purple-700 text-white rounded-lg h-12"
                required
              />
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-black border-purple-700 text-white rounded-lg h-12"
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="bg-black border-purple-700 text-white rounded-lg h-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="bg-black border-purple-700 text-white rounded-lg h-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

                <div className="flex items-start">
                  <input 
                    type="checkbox" 
                    className="mr-3 mt-1" 
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                    required 
                  />
                  <span className="text-gray-400 text-sm">
                    I agree to the{' '}
                    {legalDocs.terms ? (
                      <a 
                        href={legalDocs.terms} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline"
                      >
                        Terms & Conditions
                      </a>
                    ) : (
                      <span className="text-purple-400">Terms & Conditions</span>
                    )}
                    {' '}and{' '}
                    {legalDocs.privacy ? (
                      <a 
                        href={legalDocs.privacy} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline"
                      >
                        Privacy Policy
                      </a>
                    ) : (
                      <span className="text-purple-400">Privacy Policy</span>
                    )}
                  </span>
                </div>

                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg"
                >
                  {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">OR</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSignupMethod('otp')}
                  className="w-full mt-4 border-purple-700 text-purple-400 hover:bg-purple-600 hover:text-white"
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Quick Signup with OTP
                </Button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold">
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <OTPLogin
              onBack={() => setSignupMethod('email')}
              onSuccess={() => navigate('/')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;

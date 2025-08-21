import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const emailSignupForm = (
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
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="text-4xl font-black text-white tracking-tight">
              <span className="text-purple-600">TITAN</span> EVOLVE
            </div>
          </Link>
        </div>

        {/* Signup Form */}
        <Card className="w-full max-w-md bg-gray-900/95 backdrop-blur-sm border border-purple-800/50 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
            <p className="text-gray-400">Join us today</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {emailSignupForm}
            
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* OTP Setup Instructions */}
        <Card className="w-full max-w-md bg-yellow-900/20 backdrop-blur-sm border border-yellow-600/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-yellow-400 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              OTP Signup Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-yellow-200 text-sm">
              To enable OTP signup, you need to set up a real SMS service provider:
            </p>
            <div className="space-y-2 text-xs text-yellow-100">
              <p><strong>1. Choose a provider:</strong> Twilio, AWS SNS, or MSG91</p>
              <p><strong>2. Get API credentials</strong> from your chosen provider</p>
              <p><strong>3. Add credentials</strong> to your environment variables</p>
              <p><strong>4. Update the OTP service</strong> to use real SMS delivery</p>
            </div>
            <p className="text-yellow-300 text-xs mt-3">
              <strong>Note:</strong> OTP functionality is temporarily disabled as it requires a real SMS service for production use.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Smartphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import OTPLogin from '@/components/OTPLogin';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in."
        });
        navigate('/');
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

        {/* Login Form */}
        <div className="bg-gray-900 p-8 rounded-xl border border-purple-800/30">
          {loginMethod === 'email' ? (
            <>
              <h1 className="text-3xl font-black text-center mb-2 text-white">WELCOME BACK</h1>
              <p className="text-gray-400 text-center mb-8">Sign in to your account</p>

              <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-400 text-sm">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-purple-400 text-sm hover:text-purple-300">
                Forgot Password?
              </Link>
            </div>

                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg"
                >
                  {loading ? 'SIGNING IN...' : 'SIGN IN'}
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
                  onClick={() => setLoginMethod('otp')}
                  className="w-full mt-4 border-purple-700 text-purple-400 hover:bg-purple-600 hover:text-white"
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Login with OTP
                </Button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-bold">
                    Sign Up
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <OTPLogin
              onBack={() => setLoginMethod('email')}
              onSuccess={() => navigate('/')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

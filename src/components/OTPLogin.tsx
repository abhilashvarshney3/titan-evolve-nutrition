import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OTPLoginProps {
  onBack: () => void;
  onSuccess: () => void;
}

const OTPLogin: React.FC<OTPLoginProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpId, setOtpId] = useState<string | null>(null);
  const { toast } = useToast();

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add +91 prefix if not present
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned}`;
    }
    return phone;
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      // Store OTP in database
      const { data, error } = await supabase
        .from('sms_otp')
        .insert([{
          phone_number: formattedPhone,
          otp_code: otpCode,
          expires_at: expiresAt.toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      setOtpId(data.id);
      
      // In a real implementation, you would send SMS here
      // For demo purposes, we'll show the OTP in a toast
      toast({
        title: "OTP Sent!",
        description: `Your verification code is: ${otpCode}`,
        duration: 10000
      });

      setStep('otp');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Failed to Send OTP",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    if (!otpId) {
      toast({
        title: "Error",
        description: "No OTP session found. Please request a new code.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Verify OTP
      const { data: otpData, error: otpError } = await supabase
        .from('sms_otp')
        .select('*')
        .eq('id', otpId)
        .eq('otp_code', otp)
        .eq('is_verified', false)
        .single();

      if (otpError || !otpData) {
        toast({
          title: "Invalid OTP",
          description: "The verification code is incorrect or has expired",
          variant: "destructive"
        });
        return;
      }

      // Check if OTP is expired
      if (new Date(otpData.expires_at) < new Date()) {
        toast({
          title: "OTP Expired",
          description: "The verification code has expired. Please request a new one.",
          variant: "destructive"
        });
        return;
      }

      // Mark OTP as verified
      const { error: updateError } = await supabase
        .from('sms_otp')
        .update({ is_verified: true })
        .eq('id', otpId);

      if (updateError) throw updateError;

      // Check if user exists with this phone number
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', otpData.phone_number)
        .maybeSingle();

      if (userError) throw userError;

      if (existingUser) {
        // User exists, create a session (in a real app, you'd handle this differently)
        toast({
          title: "Login Successful!",
          description: "Welcome back!"
        });
        onSuccess();
      } else {
        // New user, redirect to complete profile
        toast({
          title: "Phone Verified!",
          description: "Please complete your profile to continue",
        });
        // Store phone number in localStorage for profile completion
        localStorage.setItem('verified_phone', otpData.phone_number);
        onSuccess();
      }

    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Verification Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (otpId) {
      // Mark current OTP as expired
      await supabase
        .from('sms_otp')
        .update({ expires_at: new Date().toISOString() })
        .eq('id', otpId);
    }
    
    setOtpId(null);
    setStep('phone');
    await sendOTP();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-purple-400 hover:text-purple-300 p-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="h-8 w-8 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {step === 'phone' ? 'Login with OTP' : 'Verify Your Phone'}
        </h2>
        <p className="text-gray-400">
          {step === 'phone' 
            ? 'Enter your phone number to receive a verification code'
            : `Enter the 6-digit code sent to ${phoneNumber}`
          }
        </p>
      </div>

      {step === 'phone' ? (
        <div className="space-y-4">
          <div>
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-black border-purple-700 text-white rounded-lg h-12 text-center text-lg"
              maxLength={10}
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Enter 10-digit mobile number without country code
            </p>
          </div>

          <Button
            onClick={sendOTP}
            disabled={loading || !phoneNumber}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg h-12"
          >
            {loading ? 'SENDING OTP...' : 'SEND OTP'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="w-12 h-12 text-lg bg-black border-purple-700 text-white" />
                <InputOTPSlot index={1} className="w-12 h-12 text-lg bg-black border-purple-700 text-white" />
                <InputOTPSlot index={2} className="w-12 h-12 text-lg bg-black border-purple-700 text-white" />
                <InputOTPSlot index={3} className="w-12 h-12 text-lg bg-black border-purple-700 text-white" />
                <InputOTPSlot index={4} className="w-12 h-12 text-lg bg-black border-purple-700 text-white" />
                <InputOTPSlot index={5} className="w-12 h-12 text-lg bg-black border-purple-700 text-white" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={verifyOTP}
            disabled={loading || otp.length !== 6}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg h-12"
          >
            {loading ? 'VERIFYING...' : 'VERIFY OTP'}
          </Button>

          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
            <Button
              variant="ghost"
              onClick={resendOTP}
              disabled={loading}
              className="text-purple-400 hover:text-purple-300"
            >
              Resend OTP
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPLogin;
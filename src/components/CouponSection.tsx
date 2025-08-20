import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tag, X } from 'lucide-react';

interface CouponSectionProps {
  onCouponApplied: (discount: number) => void;
  cartTotal: number;
}

interface Coupon {
  id: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount?: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  valid_from?: string;
  valid_until?: string;
}

const CouponSection: React.FC<CouponSectionProps> = ({ onCouponApplied, cartTotal }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateAndApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        toast({
          title: "Invalid Coupon",
          description: "Coupon code not found or expired",
          variant: "destructive"
        });
        return;
      }

      const coupon = data as Coupon;
      const now = new Date();

      // Check if coupon is within valid date range
      if (coupon.valid_from && new Date(coupon.valid_from) > now) {
        toast({
          title: "Invalid Coupon",
          description: "This coupon is not yet active",
          variant: "destructive"
        });
        return;
      }

      if (coupon.valid_until && new Date(coupon.valid_until) < now) {
        toast({
          title: "Expired Coupon",
          description: "This coupon has expired",
          variant: "destructive"
        });
        return;
      }

      // Check minimum order amount
      if (coupon.minimum_order_amount && cartTotal < coupon.minimum_order_amount) {
        toast({
          title: "Minimum Order Not Met",
          description: `Minimum order amount of ₹${coupon.minimum_order_amount} required`,
          variant: "destructive"
        });
        return;
      }

      // Check usage limit
      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        toast({
          title: "Coupon Limit Exceeded",
          description: "This coupon has reached its usage limit",
          variant: "destructive"
        });
        return;
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discount_type === 'percentage') {
        discountAmount = (cartTotal * coupon.discount_value) / 100;
        if (coupon.maximum_discount_amount) {
          discountAmount = Math.min(discountAmount, coupon.maximum_discount_amount);
        }
      } else {
        discountAmount = coupon.discount_value;
      }

      // Apply coupon
      setAppliedCoupon(coupon);
      onCouponApplied(discountAmount);
      
      toast({
        title: "Coupon Applied!",
        description: `You saved ₹${discountAmount.toFixed(0)}`,
        variant: "default"
      });

    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "Error",
        description: "Failed to apply coupon",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    onCouponApplied(0);
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your order",
    });
  };

  return (
    <div className="border border-purple-800/30 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-purple-400">
        <Tag className="h-4 w-4" />
        <span className="font-medium">Have a coupon code?</span>
      </div>
      
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-600/20 border border-green-600/30 rounded-lg p-3">
          <div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-green-400" />
              <span className="font-bold text-green-400">{appliedCoupon.code}</span>
            </div>
            {appliedCoupon.description && (
              <p className="text-sm text-gray-300 mt-1">{appliedCoupon.description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeCoupon}
            className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="bg-black border-purple-800/30 text-white placeholder-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && validateAndApplyCoupon()}
          />
          <Button
            onClick={validateAndApplyCoupon}
            disabled={isLoading || !couponCode.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6"
          >
            {isLoading ? 'Applying...' : 'Apply'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CouponSection;
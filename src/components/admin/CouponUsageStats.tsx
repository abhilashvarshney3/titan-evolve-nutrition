import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

interface CouponUsageStat {
  coupon_code: string;
  total_usage: number;
  total_discount: number;
  last_used_at: string;
  is_active: boolean;
}

const CouponUsageStats: React.FC = () => {
  const [stats, setStats] = useState<CouponUsageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStats, setTotalStats] = useState({
    totalUsage: 0,
    totalDiscount: 0,
    activeCoupons: 0
  });

  useEffect(() => {
    fetchCouponStats();
    
    // Set up real-time subscription for coupon usage
    const channel = supabase
      .channel('coupon-usage-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coupon_usage'
        },
        () => {
          console.log('Coupon usage updated, refreshing stats...');
          fetchCouponStats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coupons'
        },
        () => {
          console.log('Coupon updated, refreshing stats...');
          fetchCouponStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCouponStats = async () => {
    try {
      setLoading(true);
      
      // Get coupon usage statistics
      const { data: usageData, error: usageError } = await supabase
        .from('coupon_usage')
        .select(`
          coupon_id,
          discount_amount,
          created_at,
          coupons!inner(
            code,
            is_active
          )
        `);

      if (usageError) throw usageError;

      // Process the data to get stats per coupon
      const couponStats: { [key: string]: CouponUsageStat } = {};
      let totalUsage = 0;
      let totalDiscount = 0;
      
      usageData?.forEach(usage => {
        const couponCode = usage.coupons.code;
        const isActive = usage.coupons.is_active;
        
        if (!couponStats[couponCode]) {
          couponStats[couponCode] = {
            coupon_code: couponCode,
            total_usage: 0,
            total_discount: 0,
            last_used_at: usage.created_at,
            is_active: isActive
          };
        }
        
        couponStats[couponCode].total_usage += 1;
        couponStats[couponCode].total_discount += Number(usage.discount_amount);
        
        // Update last used date if this usage is more recent
        if (new Date(usage.created_at) > new Date(couponStats[couponCode].last_used_at)) {
          couponStats[couponCode].last_used_at = usage.created_at;
        }
        
        totalUsage += 1;
        totalDiscount += Number(usage.discount_amount);
      });

      // Get active coupons count
      const { data: couponsData, error: couponsError } = await supabase
        .from('coupons')
        .select('id')
        .eq('is_active', true);

      if (couponsError) throw couponsError;

      setStats(Object.values(couponStats).sort((a, b) => b.total_usage - a.total_usage));
      setTotalStats({
        totalUsage,
        totalDiscount,
        activeCoupons: couponsData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching coupon stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Coupon Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading coupon statistics...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-2xl font-bold text-foreground">{totalStats.totalUsage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Discount Given</p>
                <p className="text-2xl font-bold text-foreground">₹{totalStats.totalDiscount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Coupons</p>
                <p className="text-2xl font-bold text-foreground">{totalStats.activeCoupons}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Coupon Performance (Real-time)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No coupon usage data available yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.map((stat) => (
                <div
                  key={stat.coupon_code}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-card"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-foreground">{stat.coupon_code}</span>
                        <Badge variant={stat.is_active ? "default" : "secondary"}>
                          {stat.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        Last used: {new Date(stat.last_used_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">{stat.total_usage} uses</div>
                    <div className="text-sm text-muted-foreground">₹{stat.total_discount.toFixed(2)} saved</div>
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

export default CouponUsageStats;
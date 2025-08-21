import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Banner {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  button_text?: string;
  banner_type: string;
  position: string;
  is_active: boolean;
  display_order: number;
  start_date?: string;
  end_date?: string;
}

const PromotionBanner = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromotionBanner();
  }, []);

  const loadPromotionBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('banner_type', 'promotional')
        .eq('is_active', true)
        .eq('position', 'middle')
        .order('display_order', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setBanner(data || null);
    } catch (error) {
      console.error('Error loading promotion banner:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !banner) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-r from-purple-800 via-pink-600 to-red-600 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Main Promotion */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Gift className="h-12 w-12 text-white animate-bounce" />
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tight">
                {banner.title}
              </h2>
              <Gift className="h-12 w-12 text-white animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
            
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
              MEGA SUPPLEMENT SALE
            </h3>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {banner.description || "Transform your fitness journey with premium supplements at unbeatable prices."}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white">Free Shipping</h4>
              <p className="text-white/80">On orders above ₹2999</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white">Free Samples</h4>
              <p className="text-white/80">Try before you buy</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white">24/7 Support</h4>
              <p className="text-white/80">Expert guidance anytime</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to={banner.link_url || "/shop"}>
              <Button 
                size="lg" 
                className="bg-white text-purple-800 hover:bg-gray-100 px-12 py-4 text-xl font-black shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {banner.button_text || "SHOP NOW"}
                <Zap className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            
            <div className="text-white text-center">
              <p className="text-sm font-semibold mb-1">HURRY UP! OFFER ENDS IN</p>
              <div className="flex space-x-2 justify-center">
                <div className="bg-white/20 px-3 py-2 rounded-lg">
                  <span className="text-2xl font-bold">02</span>
                  <p className="text-xs">DAYS</p>
                </div>
                <div className="bg-white/20 px-3 py-2 rounded-lg">
                  <span className="text-2xl font-bold">14</span>
                  <p className="text-xs">HOURS</p>
                </div>
                <div className="bg-white/20 px-3 py-2 rounded-lg">
                  <span className="text-2xl font-bold">35</span>
                  <p className="text-xs">MINS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner;

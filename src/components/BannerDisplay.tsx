import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Clock, Flame, Star, Zap } from 'lucide-react';
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

interface BannerDisplayProps {
  position: 'top' | 'middle' | 'bottom' | 'hero';
  className?: string;
}

const getBaseBannerStyles = (banner: Banner, position: string) => {
  const baseStyles = position === 'hero' 
    ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 md:py-16 px-4 md:px-6' 
    : position === 'top'
    ? 'bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 py-3 md:py-6 px-4 md:px-6 shadow-xl'
    : 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 py-6 md:py-12 px-4 md:px-6 shadow-xl';
  
  const bannerTypeStyles = banner.banner_type === 'announcement' && position === 'top' 
    ? 'animate-pulse' 
    : banner.banner_type === 'promotional' 
    ? 'animate-[gradient_3s_ease-in-out_infinite]' 
    : '';
  
  return `${baseStyles} ${bannerTypeStyles}`;
};

const BannerDisplay: React.FC<BannerDisplayProps> = ({ position, className = '' }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetchBanners();
  }, [position]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (banners.length === 0) return;
      
      const banner = banners[0];
      if (!banner.end_date) return;
      
      const endTime = new Date(banner.end_date).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [banners]);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Filter banners by date
      const now = new Date();
      const activeBanners = (data || []).filter(banner => {
        const startDate = banner.start_date ? new Date(banner.start_date) : null;
        const endDate = banner.end_date ? new Date(banner.end_date) : null;
        
        if (startDate && startDate > now) return false;
        if (endDate && endDate < now) return false;
        
        return true;
      });

      setBanners(activeBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const dismissBanner = (bannerId: string) => {
    setDismissedBanners(prev => [...prev, bannerId]);
  };

  const visibleBanners = banners.filter(banner => !dismissedBanners.includes(banner.id));

  if (visibleBanners.length === 0) return null;

  return (
    <div className={`banner-display ${className}`}>
      {visibleBanners.map((banner) => (
        <div
          key={banner.id}
          className={`relative w-full overflow-hidden ${getBaseBannerStyles(banner, position)}`}
        >
          {/* Enhanced Decorative Elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-black/20" />
            {position !== 'top' && (
              <>
                <div className="absolute top-10 left-10 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
              </>
            )}
          </div>
          
          <div className="container mx-auto relative z-10">
            {/* Enhanced Top Banner Layout */}
            {position === 'top' ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 min-h-[3rem] md:min-h-[4rem]">
                {/* Static Title and CTA Section */}
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 order-1 md:order-1">
                  <h3 className="text-sm md:text-lg font-bold text-white drop-shadow-lg whitespace-nowrap">
                    {banner.title}
                  </h3>
                  {banner.link_url && banner.button_text && (
                    <Button
                      size="sm"
                      onClick={() => window.open(banner.link_url, '_blank')}
                      className="bg-white text-red-600 hover:bg-gray-100 font-bold shadow-lg hover:shadow-xl transition-all duration-300 px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm whitespace-nowrap"
                    >
                      {banner.button_text}
                    </Button>
                  )}
                </div>

                {/* Flowing Animation Section */}
                <div className="flex-1 overflow-hidden relative min-h-[2rem] md:min-h-[3rem] order-2 md:order-2 w-full md:w-auto">
                  <div className="absolute inset-0 flex items-center">
                    {banner.banner_type === 'announcement' ? (
                      /* Running Text Animation */
                      <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap flex items-center gap-8">
                        <span className="text-xs md:text-sm text-yellow-300 font-semibold flex items-center gap-2">
                          <Flame className="h-3 w-3 md:h-4 md:w-4 animate-pulse" />
                          {banner.description || "Special Offer Available"}
                          <Star className="h-3 w-3 md:h-4 md:w-4 animate-pulse" />
                        </span>
                        <span className="text-xs md:text-sm text-yellow-300 font-semibold flex items-center gap-2">
                          <Zap className="h-3 w-3 md:h-4 md:w-4 animate-pulse" />
                          Limited Time Only
                          <Flame className="h-3 w-3 md:h-4 md:w-4 animate-pulse" />
                        </span>
                        <span className="text-xs md:text-sm text-yellow-300 font-semibold flex items-center gap-2">
                          <Star className="h-3 w-3 md:h-4 md:w-4 animate-pulse" />
                          Don't Miss Out!
                          <Zap className="h-3 w-3 md:h-4 md:w-4 animate-pulse" />
                        </span>
                      </div>
                    ) : (
                      /* Flowing Image and Text Animation */
                      <div className="animate-[flow_25s_linear_infinite] whitespace-nowrap flex items-center gap-4 md:gap-8">
                        {banner.image_url && (
                          <img 
                            src={banner.image_url} 
                            alt={banner.title}
                            className="w-6 h-6 md:w-8 md:h-8 object-cover rounded-full shadow-lg ring-1 ring-white/30"
                          />
                        )}
                        <span className="text-xs md:text-sm text-white/90 font-medium">
                          {banner.description || "Exclusive Offer"}
                        </span>
                        {banner.image_url && (
                          <img 
                            src={banner.image_url} 
                            alt={banner.title}
                            className="w-6 h-6 md:w-8 md:h-8 object-cover rounded-full shadow-lg ring-1 ring-white/30"
                          />
                        )}
                        <span className="text-xs md:text-sm text-purple-300 font-medium">
                          Premium Quality
                        </span>
                        {banner.image_url && (
                          <img 
                            src={banner.image_url} 
                            alt={banner.title}
                            className="w-6 h-6 md:w-8 md:h-8 object-cover rounded-full shadow-lg ring-1 ring-white/30"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Regular Banner Layout */
              <div className={`${position === 'hero' ? 'text-center' : 'grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center'}`}>
                
                {/* Image Section - Enhanced */}
                {banner.image_url && (
                  <div className={`${position === 'hero' ? 'mb-6 md:mb-8' : 'order-2 lg:order-1'}`}>
                    <div className="relative group">
                      <img 
                        src={banner.image_url} 
                        alt={banner.title}
                        className={`${
                          position === 'hero' 
                            ? 'w-full max-w-md md:max-w-2xl mx-auto rounded-2xl md:rounded-3xl shadow-2xl ring-2 md:ring-4 ring-white/20 transform group-hover:scale-105 transition-all duration-500' 
                            : 'w-full max-w-xs md:max-w-md mx-auto rounded-xl md:rounded-2xl shadow-2xl ring-2 md:ring-4 ring-white/30 transform group-hover:scale-105 transition-all duration-500'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl md:rounded-3xl" />
                      {/* Floating icons - hidden on mobile for cleaner look */}
                      <div className="hidden md:block absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 animate-bounce">
                        <Star className="h-4 w-4 md:h-6 md:w-6 text-yellow-800 fill-current" />
                      </div>
                      <div className="hidden md:block absolute -bottom-4 -left-4 bg-red-500 rounded-full p-3 animate-bounce" style={{ animationDelay: '0.5s' }}>
                        <Flame className="h-4 w-4 md:h-6 md:w-6 text-white" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Section - Enhanced */}
                <div className={`${position === 'hero' ? 'space-y-4 md:space-y-8' : 'order-1 lg:order-2 space-y-3 md:space-y-6'}`}>
                  
                  {/* Title with Animation */}
                  <div className="relative">
                    <h3 className={`font-black tracking-tight ${
                      position === 'hero' ? 'text-3xl md:text-5xl lg:text-7xl text-white leading-tight' : 'text-2xl md:text-4xl lg:text-5xl text-white leading-tight'
                    } animate-fade-in`}>
                      {banner.title}
                      {banner.banner_type === 'promotional' && (
                        <div className="absolute -top-1 md:-top-2 -right-4 md:-right-8 bg-yellow-400 text-black px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold animate-pulse rotate-12">
                          SALE!
                        </div>
                      )}
                    </h3>
                  </div>

                  {/* Description */}
                  {banner.description && (
                    <p className={`${
                      position === 'hero' ? 'text-lg md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-medium' :
                      'text-base md:text-xl text-white/95 leading-relaxed font-medium max-w-2xl'
                    } animate-fade-in`} style={{ animationDelay: '0.2s' }}>
                      {banner.description}
                    </p>
                  )}

                  {/* Countdown Timer - New Feature */}
                  {banner.end_date && (timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) && (
                    <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                      <div className="bg-black/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border border-white/20">
                        <div className="flex items-center justify-center gap-1 md:gap-2 mb-3 md:mb-4">
                          <Clock className="h-4 w-4 md:h-6 md:w-6 text-yellow-400 animate-pulse" />
                          <span className="text-white font-bold text-sm md:text-lg uppercase tracking-wider">Sale Ends In:</span>
                          <Zap className="h-4 w-4 md:h-6 md:w-6 text-yellow-400 animate-pulse" />
                        </div>
                        <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-xs md:max-w-md mx-auto">
                          {[
                            { label: 'Days', value: timeLeft.days },
                            { label: 'Hours', value: timeLeft.hours },
                            { label: 'Mins', value: timeLeft.minutes },
                            { label: 'Secs', value: timeLeft.seconds }
                          ].map((item, index) => (
                            <div key={index} className="text-center">
                              <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-3 mb-1 md:mb-2 border border-white/30">
                                <span className="text-lg md:text-3xl font-black text-white block">{item.value.toString().padStart(2, '0')}</span>
                              </div>
                              <span className="text-white/80 text-xs md:text-sm font-semibold uppercase tracking-wider">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced CTA Button */}
                  {banner.link_url && banner.button_text && (
                    <div className={`${position === 'hero' ? 'mt-6 md:mt-10' : 'mt-6 md:mt-8'} animate-fade-in`} style={{ animationDelay: '0.6s' }}>
                      <Button
                        size={position === 'hero' ? 'lg' : 'default'}
                        onClick={() => window.open(banner.link_url, '_blank')}
                        className={`${
                          position === 'hero' 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-8 md:px-12 py-4 md:py-6 text-lg md:text-xl font-black shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-0 rounded-xl' 
                            : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 px-6 md:px-10 py-3 md:py-4 text-base md:text-lg rounded-xl'
                        } group relative overflow-hidden`}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Zap className="h-4 w-4 md:h-5 md:w-5" />
                          {banner.button_text}
                          <Flame className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </Button>
                    </div>
                  )}

                  {/* Urgency Text */}
                  {banner.banner_type === 'promotional' && (
                    <div className="flex items-center justify-center gap-1 md:gap-2 text-yellow-300 font-bold text-sm md:text-lg animate-pulse">
                      <Flame className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-center">Limited Time Offer - Don't Miss Out!</span>
                      <Flame className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
            
          {/* Close button for non-hero banners */}
          {position !== 'hero' && position !== 'top' && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 md:top-4 right-2 md:right-4 text-white/80 hover:text-white hover:bg-white/20 transition-colors duration-200 rounded-full p-1 md:p-2"
              onClick={() => dismissBanner(banner.id)}
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default BannerDisplay;
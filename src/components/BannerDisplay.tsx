import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
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

const BannerDisplay: React.FC<BannerDisplayProps> = ({ position, className = '' }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);

  useEffect(() => {
    fetchBanners();
  }, [position]);

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
          className={`relative w-full overflow-hidden ${
            position === 'hero' 
              ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-6' 
              : position === 'top'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6 shadow-lg'
              : 'bg-gradient-to-r from-slate-50 to-white border border-slate-200 py-8 px-6 shadow-sm'
          } ${banner.banner_type === 'announcement' ? 'animate-pulse' : ''}`}
        >
          {/* Decorative Elements */}
          {position === 'hero' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
              <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
            </>
          )}
          
          <div className="container mx-auto flex items-center justify-between relative z-10">
            <div className="flex-1">
              <div className={`${position === 'hero' ? 'text-center' : 'flex items-center gap-6'}`}>
                {banner.image_url && position !== 'top' && (
                  <div className={`${position === 'hero' ? 'mb-8' : 'flex-shrink-0'}`}>
                    <img 
                      src={banner.image_url} 
                      alt={banner.title}
                      className={`${
                        position === 'hero' 
                          ? 'w-full max-w-lg mx-auto rounded-2xl shadow-2xl ring-1 ring-white/10' 
                          : 'w-20 h-20 object-cover rounded-xl shadow-lg ring-2 ring-white/20'
                      }`}
                    />
                  </div>
                )}
                <div className={position === 'hero' ? 'space-y-6' : 'flex-1 space-y-3'}>
                  <h3 className={`font-bold ${
                    position === 'hero' ? 'text-4xl md:text-6xl text-white leading-tight' : 
                    position === 'top' ? 'text-lg text-white drop-shadow-sm' : 'text-2xl text-slate-900'
                  }`}>
                    {banner.title}
                  </h3>
                  {banner.description && (
                    <p className={`${
                      position === 'hero' ? 'text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed' :
                      position === 'top' ? 'text-sm text-white/90 drop-shadow-sm' : 'text-lg text-slate-600 leading-relaxed'
                    }`}>
                      {banner.description}
                    </p>
                  )}
                  {banner.link_url && banner.button_text && (
                    <div className={position === 'hero' ? 'mt-8' : 'mt-4'}>
                      <Button
                        variant={position === 'top' ? 'secondary' : 'default'}
                        size={position === 'hero' ? 'lg' : position === 'top' ? 'sm' : 'default'}
                        onClick={() => window.open(banner.link_url, '_blank')}
                        className={`${
                          position === 'hero' 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border-0' 
                            : position === 'top'
                            ? 'bg-white text-purple-600 hover:bg-slate-50 font-semibold shadow-md hover:shadow-lg transition-all duration-200'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
                        }`}
                      >
                        {banner.button_text}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {position !== 'hero' && (
              <Button
                variant="ghost"
                size="sm"
                className={`ml-6 ${
                  position === 'top' 
                    ? 'text-white/80 hover:text-white hover:bg-white/10' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                } transition-colors duration-200`}
                onClick={() => dismissBanner(banner.id)}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerDisplay;
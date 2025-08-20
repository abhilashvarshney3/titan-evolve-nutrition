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
          className={`relative w-full ${
            position === 'hero' 
              ? 'bg-gradient-to-r from-primary/10 to-primary/5 py-16 px-6' 
              : position === 'top'
              ? 'bg-primary text-primary-foreground py-3 px-4'
              : 'bg-muted py-6 px-4'
          } ${banner.banner_type === 'announcement' ? 'animate-pulse' : ''}`}
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex-1">
              <div className={`${position === 'hero' ? 'text-center' : 'flex items-center gap-4'}`}>
                {banner.image_url && position !== 'top' && (
                  <img 
                    src={banner.image_url} 
                    alt={banner.title}
                    className={`${
                      position === 'hero' 
                        ? 'w-full max-w-md mx-auto mb-6 rounded-lg' 
                        : 'w-16 h-16 object-cover rounded-lg'
                    }`}
                  />
                )}
                <div className={position === 'hero' ? 'space-y-4' : 'flex-1'}>
                  <h3 className={`font-bold ${
                    position === 'hero' ? 'text-3xl md:text-4xl' : 
                    position === 'top' ? 'text-sm' : 'text-lg'
                  }`}>
                    {banner.title}
                  </h3>
                  {banner.description && (
                    <p className={`${
                      position === 'hero' ? 'text-lg text-muted-foreground max-w-2xl mx-auto' :
                      position === 'top' ? 'text-xs' : 'text-sm text-muted-foreground'
                    }`}>
                      {banner.description}
                    </p>
                  )}
                  {banner.link_url && banner.button_text && (
                    <div className={position === 'hero' ? 'mt-6' : 'mt-2'}>
                      <Button
                        variant={position === 'top' ? 'secondary' : 'default'}
                        size={position === 'hero' ? 'lg' : position === 'top' ? 'sm' : 'default'}
                        onClick={() => window.open(banner.link_url, '_blank')}
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
                className="ml-4 opacity-70 hover:opacity-100"
                onClick={() => dismissBanner(banner.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerDisplay;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useStore } from './useStore';

export const usePageViewTracking = () => {
  const location = useLocation();
  const { store } = useStore();

  useEffect(() => {
    const trackPageView = async () => {
      if (!store?.id) return;

      try {
        // Track the page view
        await supabase.from('page_views').insert({
          store_id: store.id,
          page_path: location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        });

        console.log('Page view tracked:', {
          store_id: store.id,
          page_path: location.pathname,
        });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [location.pathname, store?.id]);
};

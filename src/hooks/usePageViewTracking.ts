
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useStore } from './useStore';

export const usePageViewTracking = () => {
  const location = useLocation();
  const { store } = useStore();

  useEffect(() => {
    const trackPageView = async () => {
      if (!store?.id) {
        console.log('Page view tracking: No store ID available');
        return;
      }

      try {
        console.log('Page view tracking: Tracking view for', {
          store_id: store.id,
          page_path: location.pathname,
        });

        // Track the page view
        const { data, error } = await supabase.from('page_views').insert({
          store_id: store.id,
          page_path: location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        });

        if (error) {
          console.error('Page view tracking error:', error);
        } else {
          console.log('Page view tracked successfully:', {
            store_id: store.id,
            page_path: location.pathname,
          });
        }
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    // Add a small delay to ensure store is loaded
    const timeoutId = setTimeout(trackPageView, 100);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname, store?.id]);
};


import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStoreData } from "@/hooks/useStoreData";

interface UseStoreVisibilityParams {
  storeId: string | undefined;
}

export const useStoreVisibility = ({ storeId }: UseStoreVisibilityParams) => {
  const { user } = useAuth();
  const { store, loading } = useStoreData({ 
    storeId, 
    currentUserId: user?.id 
  });
  const [shouldShowComingSoon, setShouldShowComingSoon] = useState(false);

  useEffect(() => {
    if (loading || !store) {
      setShouldShowComingSoon(false);
      return;
    }

    // Check if store is private
    const isPrivate = !store.settings.is_public;
    
    // Check if current user is the store owner
    const isOwner = user && store && user.id === store.user_id;
    
    // Show coming soon if store is private AND user is not the owner
    const showComingSoon = isPrivate && !isOwner;
    
    console.log("Store visibility check:", {
      storeId,
      isPrivate,
      isOwner,
      showComingSoon,
      userId: user?.id,
      storeUserId: store?.user_id
    });
    
    setShouldShowComingSoon(showComingSoon);
  }, [store, user, loading, storeId]);

  return {
    shouldShowComingSoon,
    loading,
    store,
    isOwner: user && store && user.id === store.user_id,
    isPrivate: store ? !store.settings.is_public : false
  };
};


import { useParams } from "react-router-dom";
import { useStoreData } from "@/hooks/useStoreData";
import { useAuth } from "@/contexts/AuthContext";
import { PageElementRenderer } from "@/components/store/PageElementRenderer";

const ComingSoon = () => {
  const { storeId } = useParams();
  const { user } = useAuth();
  const { store, loading } = useStoreData({ 
    storeId, 
    currentUserId: user?.id 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-40 bg-muted rounded mb-4"></div>
        </div>
      </div>
    );
  }

  // Get logo from store settings
  const logo = store?.settings?.logo || null;
  const storeName = store?.name || "Store";
  
  // Get custom coming soon elements if they exist
  const comingSoonElements = store?.settings?.comingSoonElements || [];

  // Default elements if no custom ones are set
  const defaultElements = [
    {
      id: 'coming-soon-logo',
      type: 'image',
      settings: {
        src: logo?.url || '',
        alt: logo?.alt || storeName,
        width: 200,
        height: 80,
        alignment: 'center',
        className: 'mb-8'
      }
    },
    {
      id: 'coming-soon-title',
      type: 'text',
      settings: {
        content: '<h1 class="text-4xl md:text-6xl font-bold text-foreground mb-4">Coming Soon</h1>',
        alignment: 'center'
      }
    },
    {
      id: 'coming-soon-description',
      type: 'text',
      settings: {
        content: '<p class="text-muted-foreground text-lg">We\'re working on something amazing. Stay tuned!</p>',
        alignment: 'center'
      }
    }
  ];

  const elementsToRender = comingSoonElements.length > 0 ? comingSoonElements : defaultElements;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <PageElementRenderer 
          elements={elementsToRender}
          products={[]}
          storeId={storeId || ''}
          onNavigate={() => {}}
        />
      </div>
    </div>
  );
};

export default ComingSoon;

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
  
  // Default elements with CLEAN content (no HTML tags)
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
        content: 'Coming Soon', // Clean text, no HTML
        alignment: 'center',
        fontSize: 'xlarge',
        fontWeight: 'bold'
      }
    },
    {
      id: 'coming-soon-description',
      type: 'text',
      settings: {
        content: "We're working on something amazing. Stay tuned!", // Clean text
        alignment: 'center',
        textColor: 'muted'
      }
    }
  ];

  const elementsToRender = comingSoonElements.length > 0 ? comingSoonElements : defaultElements;

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
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


import { useParams } from "react-router-dom";
import { withStoreLayout } from "@/components/layout/StorePageLayout";
import { useStore } from "@/hooks/useStore";

const CustomPage = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { store, loading, getCustomPage, getPageElements } = useStore();
  
  const customPage = getCustomPage(slug || '');
  const pageElements = slug ? getPageElements(slug) : [];
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-accent/50 rounded w-1/3"></div>
          <div className="h-4 bg-accent/50 rounded w-full"></div>
          <div className="h-4 bg-accent/50 rounded w-5/6"></div>
          <div className="h-4 bg-accent/50 rounded w-4/6"></div>
        </div>
      </div>
    );
  }
  
  if (!customPage) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p>The page you are looking for could not be found.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{customPage.title}</h1>
        <div className="prose max-w-none mb-8">
          {customPage.content}
        </div>
        
        {/* Render page-specific elements */}
        {pageElements && pageElements.length > 0 && (
          <div className="mt-8 space-y-8">
            {pageElements.map((element) => (
              <div key={element.id} className="page-element">
                {element.type === 'text' && (
                  <div className={`text-${element.settings.alignment || 'left'}`}>
                    <p>{element.settings.content}</p>
                  </div>
                )}
                {element.type === 'image' && (
                  <img 
                    src={element.settings.src} 
                    alt={element.settings.alt || ''} 
                    className="max-w-full rounded-md mx-auto"
                  />
                )}
                {/* Add other element type renders as needed */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default withStoreLayout(CustomPage);

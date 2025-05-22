
import { useEffect, useState } from "react";
import { withStoreLayout } from "@/components/layout/StorePageLayout";
import { useStore } from "@/hooks/useStore";

const AboutPage = () => {
  const { store, loading, getPageElements } = useStore();
  
  // Get page elements specific to the about page
  const pageElements = getPageElements('about');
  
  // Get the about us content from store settings
  const aboutContent = store?.settings?.aboutUs || "About Us content will be displayed here.";
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-accent/50 rounded w-full"></div>
            <div className="h-4 bg-accent/50 rounded w-5/6"></div>
            <div className="h-4 bg-accent/50 rounded w-4/6"></div>
          </div>
        ) : (
          <div className="prose max-w-none">
            {/* Display the about content */}
            {aboutContent}
            
            {/* Render any custom page elements for the about page */}
            {pageElements && pageElements.length > 0 && (
              <div className="mt-8 space-y-8">
                {pageElements.map((element) => (
                  <div key={element.id} className="page-element">
                    {/* Render different element types */}
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Export the component with the StorePageLayout wrapper
export default withStoreLayout(AboutPage);

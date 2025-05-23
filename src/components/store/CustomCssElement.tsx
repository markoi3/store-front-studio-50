
import { useEffect } from 'react';

interface CustomCssElementProps {
  element: {
    id: string;
    type: string;
    settings: {
      content?: string;
    };
  };
}

export const CustomCssElement = ({ element }: CustomCssElementProps) => {
  const cssContent = element.settings?.content || '';
  const styleId = `custom-css-${element.id}`;
  
  useEffect(() => {
    // Create or update style element
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    styleEl.textContent = cssContent;
    
    // Cleanup on unmount
    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        document.head.removeChild(styleToRemove);
      }
    };
  }, [cssContent, styleId]);
  
  // This component doesn't actually render anything visible
  return null;
};

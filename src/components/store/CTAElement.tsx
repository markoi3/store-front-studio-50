
import { Button } from "@/components/ui/button";

interface CTAElementProps {
  element: {
    id: string;
    type: string;
    settings: {
      title?: string;
      buttonText?: string;
      buttonLink?: string;
      backgroundColor?: string;
      textColor?: string;
      titleColor?: string;
      buttonColor?: string;
      buttonTextColor?: string;
    };
  };
  onNavigate: (path: string) => void;
}

export const CTAElement = ({ element, onNavigate }: CTAElementProps) => {
  return (
    <div 
      className="text-center py-12 px-6 rounded-lg"
      style={{
        backgroundColor: element.settings?.backgroundColor || "#f3f4f6",
        color: element.settings?.textColor || "#000000"
      }}
    >
      <h3 
        className="text-xl md:text-2xl font-semibold mb-4"
        style={{color: element.settings?.titleColor || element.settings?.textColor || "#000000"}}
      >
        {element.settings?.title}
      </h3>
      {element.settings?.buttonText && (
        <Button
          onClick={() => onNavigate(element.settings?.buttonLink || '/')}
          style={{
            backgroundColor: element.settings?.buttonColor || "#3b82f6",
            color: element.settings?.buttonTextColor || "#ffffff"
          }}
        >
          {element.settings.buttonText}
        </Button>
      )}
    </div>
  );
};

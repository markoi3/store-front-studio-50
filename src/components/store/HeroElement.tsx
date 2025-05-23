
import { Button } from "@/components/ui/button";

interface HeroElementProps {
  element: {
    id: string;
    type: string;
    settings: {
      title?: string;
      subtitle?: string;
      buttonText?: string;
      buttonLink?: string;
      backgroundImage?: string;
      backgroundColor?: string;
      textColor?: string;
      subtitleColor?: string;
      buttonColor?: string;
      buttonTextColor?: string;
    };
  };
  onNavigate: (path: string) => void;
}

export const HeroElement = ({ element, onNavigate }: HeroElementProps) => {
  return (
    <div className="relative h-[70vh] bg-accent">
      <img 
        src={element.settings?.backgroundImage || ''} 
        alt="Hero" 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-white px-4"
        style={{
          backgroundColor: element.settings?.backgroundColor ? `${element.settings.backgroundColor}40` : "rgba(0,0,0,0.4)"
        }}
      >
        <h1 
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
          style={{color: element.settings?.textColor || "white"}}
        >
          {element.settings?.title || "Welcome"}
        </h1>
        <p 
          className="text-xl md:text-2xl mb-6 max-w-2xl text-center"
          style={{color: element.settings?.subtitleColor || element.settings?.textColor || "white"}}
        >
          {element.settings?.subtitle || "Discover our amazing products"}
        </p>
        {element.settings?.buttonText && (
          <Button 
            size="lg" 
            className="text-lg px-6"
            onClick={() => onNavigate(element.settings?.buttonLink || '/shop')}
            style={{
              backgroundColor: element.settings?.buttonColor || "",
              color: element.settings?.buttonTextColor || ""
            }}
          >
            {element.settings.buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};


interface ImageElementProps {
  element: {
    id: string;
    type: string;
    settings: {
      src?: string;
      alt?: string;
      caption?: string;
      borderRadius?: string;
      width?: string;
    };
  };
}

export const ImageElement = ({ element }: ImageElementProps) => {
  return (
    <div className="text-center">
      <img 
        src={element.settings?.src} 
        alt={element.settings?.alt || ''} 
        className="mx-auto"
        style={{
          maxWidth: '100%',
          borderRadius: element.settings?.borderRadius || '4px',
          width: element.settings?.width || '100%'
        }}
      />
      {element.settings?.caption && (
        <p className="text-sm text-muted-foreground mt-2">
          {element.settings.caption}
        </p>
      )}
    </div>
  );
};

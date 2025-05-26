interface TextElementProps {
  element: {
    id: string;
    type: string;
    settings: {
      content?: string;
      alignment?: string;
      backgroundColor?: string;
      textColor?: string;
    };
  };
}

export const TextElement = ({ element }: TextElementProps) => {
  return (
    <div 
      className="container mx-auto px-4 py-12"
      style={{
        backgroundColor: element.settings?.backgroundColor || ""
      }}
    >
      <div 
        className="max-w-3xl mx-auto text-center"
        style={{
          color: element.settings?.textColor || "",
          textAlign: element.settings?.alignment as any || "center"
        }}
      >
        {/* Hardkodovano za test */}
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">Coming Soon</h1>
        <p className="text-muted-foreground text-lg">We're working on something amazing. Stay tuned!</p>
      </div>
    </div>
  );
};

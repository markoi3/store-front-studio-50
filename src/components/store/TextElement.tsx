import parse from 'html-react-parser';

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
        {parse(element.settings?.content || "")}
      </div>
    </div>
  );
};

interface TextElementProps {
  element: {
    id: string;
    type: string;
    settings: {
      content?: string;
      alignment?: string;
      backgroundColor?: string;
      textColor?: string;
      fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
      fontWeight?: 'normal' | 'bold';
    };
  };
}

export const TextElement = ({ element }: TextElementProps) => {
  const { content = "", alignment = "center", backgroundColor = "", textColor = "" } = element.settings;
  
  // Check if content contains HTML tags
  const hasHTMLTags = /<[^>]*>/g.test(content);
  
  // Define font size classes
  const getFontSizeClass = (size?: string) => {
    switch (size) {
      case 'small': return 'text-sm';
      case 'large': return 'text-xl';
      case 'xlarge': return 'text-4xl md:text-6xl';
      default: return 'text-lg';
    }
  };
  
  // Define font weight classes
  const getFontWeightClass = (weight?: string) => {
    return weight === 'bold' ? 'font-bold' : '';
  };
  
  // Define alignment classes
  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      case 'center':
      default: return 'text-center';
    }
  };
  
  const textClasses = `
    ${getFontSizeClass(element.settings.fontSize)}
    ${getFontWeightClass(element.settings.fontWeight)}
    ${getAlignmentClass(alignment)}
    ${textColor === 'muted' ? 'text-muted-foreground' : ''}
  `.trim();

  return (
    <div 
      className="container mx-auto px-4 py-12"
      style={{ backgroundColor: backgroundColor || "transparent" }}
    >
      <div className="max-w-3xl mx-auto">
        {hasHTMLTags ? (
          // Render HTML content safely
          <div 
            className={textClasses}
            style={{ color: textColor && textColor !== 'muted' ? textColor : "" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          // Render plain text content
          <p 
            className={textClasses}
            style={{ color: textColor && textColor !== 'muted' ? textColor : "" }}
          >
            {content}
          </p>
        )}
      </div>
    </div>
  );
};

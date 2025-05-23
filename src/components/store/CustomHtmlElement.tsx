
interface CustomHtmlElementProps {
  element: {
    id: string;
    type: string;
    settings: {
      content?: string;
    };
  };
}

export const CustomHtmlElement = ({ element }: CustomHtmlElementProps) => {
  const htmlContent = element.settings?.content || '';
  
  return (
    <div 
      className="custom-html-element"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

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
  // Funkcija za dekodiranje HTML entities
  const decodeHtmlEntities = (str: string) => {
    const element = document.createElement('div');
    element.innerHTML = str;
    return element.textContent || element.innerText || '';
  };
  
  // Funkcija za dekodiranje HTML tagova
  const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };
  
  let processedContent = element.settings?.content || "";
  
  // Pokušajte oba načina dekodiranja
  if (processedContent.includes('&lt;') || processedContent.includes('&gt;')) {
    processedContent = decodeHtml(processedContent);
  }
  
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
        dangerouslySetInnerHTML={{ 
          __html: processedContent
        }}
      />
    </div>
  );
};

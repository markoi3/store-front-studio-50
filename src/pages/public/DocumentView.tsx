
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download, FileText, Printer } from "lucide-react";

const DocumentView = () => {
  const { documentType, documentId } = useParams();
  const [document, setDocument] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocument = () => {
      try {
        // Mock API call to fetch document data
        let documentData = null;
        
        // Get appropriate storage based on document type
        const storageKey = documentType === 'faktura' ? 'fakture' : 
                          documentType === 'predracun' ? 'predracuni' : 
                          'obracuni';
        
        // Get all documents from storage
        const storedDocuments = localStorage.getItem(storageKey);
        console.log("Looking for document", documentId, "in", storageKey, "storage");
        
        if (storedDocuments) {
          const documents = JSON.parse(storedDocuments);
          documentData = documents.find((doc: any) => doc.id === documentId);
        }
        
        // Also check in the main fakture storage which contains all document types
        if (!documentData) {
          const allDocuments = localStorage.getItem("fakture");
          if (allDocuments) {
            const documents = JSON.parse(allDocuments);
            documentData = documents.find((doc: any) => doc.id === documentId);
          }
        }
        
        if (documentData) {
          setDocument(documentData);
        } else {
          setError("Document not found");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading document:", error);
        setError("Error loading document");
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentType, documentId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Mock download functionality
    alert("Downloading document...");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border shadow-sm">
            <CardHeader className="border-b">
              <CardTitle>Loading Document...</CardTitle>
            </CardHeader>
            <CardContent className="p-12">
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-1/3 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-40 w-full bg-muted rounded"></div>
                <div className="h-10 w-1/4 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-red-500">Document Not Found</CardTitle>
              <CardDescription>
                The document you're trying to access does not exist or has been deleted.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p>
                  We couldn't find the requested document. Please check the URL or contact the
                  document owner for assistance.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const documentTitle = documentType === 'faktura' ? 'Faktura' : 
                       documentType === 'predracun' ? 'Predračun' : 
                       'Obračun';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="border shadow-sm print:border-none print:shadow-none" id="printable-document">
          <CardHeader className="border-b print:border-none">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  {documentTitle} {document.id}
                </CardTitle>
                <CardDescription>
                  Datum: {document.datum}
                  {document.rokPlacanja && ` | Rok plaćanja: ${document.rokPlacanja}`}
                </CardDescription>
              </div>
              <div className="flex gap-2 print:hidden">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-1 h-4 w-4" /> Štampaj
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-1 h-4 w-4" /> Preuzmi PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8 space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-muted-foreground text-sm mb-2">Izdavalac:</h3>
                <div className="space-y-1">
                  <p className="font-medium">Vaša Firma D.O.O.</p>
                  <p>Glavna ulica 123</p>
                  <p>11000 Beograd, Srbija</p>
                  <p>PIB: 123456789</p>
                  <p>MB: 12345678</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-muted-foreground text-sm mb-2">Klijent:</h3>
                <div className="space-y-1">
                  <p className="font-medium">{document.klijent}</p>
                  <p>{document.adresa || "Adresa nije uneta"}</p>
                  <p>PIB: {document.pib || "Nije unet"}</p>
                  <p>MB: {document.maticniBroj || "Nije unet"}</p>
                </div>
              </div>
            </div>
            
            {/* Document Details */}
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Opis</TableHead>
                    <TableHead className="text-right">Količina</TableHead>
                    <TableHead className="text-right">Cena</TableHead>
                    <TableHead className="text-right">PDV (%)</TableHead>
                    <TableHead className="text-right">Ukupno</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {document.stavke ? (
                    document.stavke.map((stavka: any, index: number) => (
                      <TableRow key={stavka.id || index}>
                        <TableCell>{stavka.opis}</TableCell>
                        <TableCell className="text-right">{stavka.kolicina}</TableCell>
                        <TableCell className="text-right font-numeric">
                          {Number(stavka.cena).toLocaleString("sr-RS")} RSD
                        </TableCell>
                        <TableCell className="text-right">{stavka.pdvStopa}%</TableCell>
                        <TableCell className="text-right font-numeric">
                          {Number(stavka.ukupno).toLocaleString("sr-RS")} RSD
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Nema stavki za prikaz.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Summary */}
            <div className="flex flex-col items-end">
              <div className="w-full md:w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ukupno bez PDV-a:</span>
                  <span className="font-medium font-numeric">
                    {Number(document.iznos - (document.pdv || 0)).toLocaleString("sr-RS")} RSD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PDV:</span>
                  <span className="font-medium font-numeric">
                    {Number(document.pdv || 0).toLocaleString("sr-RS")} RSD
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Ukupno za plaćanje:</span>
                  <span className="font-bold font-numeric">
                    {Number(document.iznos).toLocaleString("sr-RS")} RSD
                  </span>
                </div>
              </div>
            </div>
            
            {/* Footer Info */}
            {document.napomena && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Napomena:</h3>
                <p className="text-muted-foreground">{document.napomena}</p>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Način plaćanja:</h3>
              <p className="text-muted-foreground">{document.nacinPlacanja || "Nije naveden"}</p>
            </div>
            
            {document.status && (
              <div className="pt-4 border-t">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                  ${document.status === "plaćeno" ? "bg-green-100 text-green-800" :
                    document.status === "čeka uplatu" ? "bg-amber-100 text-amber-800" :
                    "bg-blue-100 text-blue-800"}`}>
                  Status: {document.status}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentView;

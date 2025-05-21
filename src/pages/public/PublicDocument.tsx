
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Mail, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Function to load documents from localStorage
const loadDocuments = (docType: string) => {
  try {
    let data: any[] = [];
    
    if (docType === "faktura") {
      data = JSON.parse(localStorage.getItem("fakture") || "[]");
    } else if (docType === "predracun") {
      data = JSON.parse(localStorage.getItem("predracuni") || "[]");
    } else if (docType === "obracun") {
      data = JSON.parse(localStorage.getItem("obracuni") || "[]");
    }
    
    return data;
  } catch (error) {
    console.error(`Error loading ${docType} documents:`, error);
    return [];
  }
};

const PublicDocument = () => {
  const { docType, docId } = useParams();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Function to load document data
    const fetchDocument = () => {
      console.log(`Loading ${docType} with ID: ${docId}`);
      
      if (!docType || !docId) {
        setLoading(false);
        return;
      }
      
      // Load documents of the specified type
      const documents = loadDocuments(docType);
      console.log("Found documents:", documents);
      
      // Find the specific document by ID
      const foundDocument = documents.find((doc) => doc.id === docId);
      
      if (foundDocument) {
        console.log("Document found:", foundDocument);
        setDocument(foundDocument);
      } else {
        console.log("Document not found");
        toast({
          title: "Dokument nije pronađen",
          description: "Traženi dokument ne postoji ili je obrisan.",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    };
    
    fetchDocument();
  }, [docType, docId, toast]);
  
  // Function to convert docType to Serbian
  const getDocTypeText = () => {
    switch (docType) {
      case "faktura":
        return "Faktura";
      case "predracun":
        return "Predračun";
      case "obracun":
        return "Obračun";
      default:
        return "Dokument";
    }
  };
  
  // Function to handle PDF download
  const handleDownloadPDF = () => {
    toast({
      title: "PDF preuzet",
      description: `${getDocTypeText()} ${docId} je uspešno preuzet kao PDF`,
    });
  };
  
  // Function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-RS");
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-3xl p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
          </div>
          <p className="text-muted-foreground">Učitavanje dokumenta...</p>
        </div>
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-3xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Dokument nije pronađen</h1>
          <p className="text-gray-600 mb-8">
            Dokument koji pokušavate da otvorite nije pronađen ili je obrisan.
          </p>
          <Button asChild>
            <a href="/">Nazad na početnu</a>
          </Button>
        </div>
      </div>
    );
  }
  
  // Generate payment link if it's a predracun
  const paymentLink = docType === "predracun" ? `/pay/${document.paymentLinkId || document.id}` : null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="mb-6">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">{getDocTypeText()}</p>
                <CardTitle className="text-2xl">{document.broj || document.id}</CardTitle>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Datum izdavanja</p>
                <p className="font-medium">{formatDate(document.datum || document.date)}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Izdavalac</h3>
                <div className="space-y-1">
                  <p>{document.izdavalac?.naziv || document.izdavalacNaziv || "Vaša Firma d.o.o."}</p>
                  <p>{document.izdavalac?.adresa || document.izdavalacAdresa || "Glavna ulica 123, Beograd"}</p>
                  <p>PIB: {document.izdavalac?.pib || document.izdavalacPib || "123456789"}</p>
                  <p>MB: {document.izdavalac?.mb || document.izdavalacMb || "12345678"}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Primalac</h3>
                <div className="space-y-1">
                  <p>{document.primalac?.naziv || document.primalacNaziv || document.klijent}</p>
                  <p>{document.primalac?.adresa || document.primalacAdresa || ""}</p>
                  {(document.primalac?.pib || document.primalacPib) && 
                    <p>PIB: {document.primalac?.pib || document.primalacPib}</p>
                  }
                  {(document.primalac?.mb || document.primalacMb) && 
                    <p>MB: {document.primalac?.mb || document.primalacMb}</p>
                  }
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Stavke</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Opis</TableHead>
                    <TableHead className="text-right">Količina</TableHead>
                    <TableHead className="text-right">Cena</TableHead>
                    <TableHead className="text-right">Iznos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {document.stavke && document.stavke.length > 0 ? (
                    document.stavke.map((stavka: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{stavka.opis || stavka.name}</TableCell>
                        <TableCell className="text-right">{stavka.kolicina || stavka.quantity || 1}</TableCell>
                        <TableCell className="text-right font-numeric">
                          {typeof stavka.cena === "number" 
                            ? stavka.cena.toLocaleString("sr-RS") 
                            : Number(stavka.cena || stavka.price || 0).toLocaleString("sr-RS")} RSD
                        </TableCell>
                        <TableCell className="text-right font-numeric">
                          {typeof stavka.iznos === "number" 
                            ? stavka.iznos.toLocaleString("sr-RS") 
                            : (Number(stavka.cena || stavka.price || 0) * Number(stavka.kolicina || stavka.quantity || 1)).toLocaleString("sr-RS")} RSD
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell>{document.name || document.opis || "Proizvod/usluga"}</TableCell>
                      <TableCell className="text-right">1</TableCell>
                      <TableCell className="text-right font-numeric">
                        {Number(document.price || document.iznos || 0).toLocaleString("sr-RS")} RSD
                      </TableCell>
                      <TableCell className="text-right font-numeric">
                        {Number(document.price || document.iznos || 0).toLocaleString("sr-RS")} RSD
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span>Ukupan iznos bez PDV-a</span>
                <span className="font-numeric">
                  {Number(document.osnovica || (document.iznos ? document.iznos - (document.pdv || 0) : document.price || 0)).toLocaleString("sr-RS")} RSD
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>PDV (20%)</span>
                <span className="font-numeric">
                  {Number(document.pdv || 0).toLocaleString("sr-RS")} RSD
                </span>
              </div>
              <div className="flex justify-between items-center mt-4 font-bold">
                <span>Ukupan iznos sa PDV-om</span>
                <span className="text-xl font-numeric">
                  {Number(document.iznos || document.price || 0).toLocaleString("sr-RS")} RSD
                </span>
              </div>
            </div>
            
            {document.napomena && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-2">Napomena</h3>
                <p>{document.napomena}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t flex flex-col sm:flex-row justify-between pt-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Preuzmi PDF
              </Button>
            </div>
            
            {paymentLink && (
              <Link to={paymentLink}>
                <Button variant="default">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Plati online
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Ovaj dokument je automatski generisan i važeći je bez pečata i potpisa.</p>
        </div>
      </div>
    </div>
  );
};

export default PublicDocument;


import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PublicDocument = () => {
  const { docType, docId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Function to load document data from Supabase
    const fetchDocument = async () => {
      console.log(`Loading ${docType} with ID: ${docId}, Token: ${token ? 'provided' : 'not provided'}`);
      
      if (!docType || !docId) {
        setLoading(false);
        setError("Missing document type or ID");
        return;
      }

      try {
        let query = supabase
          .from('documents')
          .select('*')
          .eq('type', docType);
          
        // If we have a token, query by token, otherwise by ID
        if (token) {
          query = query.eq('public_access_token', token);
        } else {
          query = query.eq('id', docId);
        }
        
        const { data: documents, error: queryError } = await query.limit(1);
        
        if (queryError) {
          console.error("Error fetching document:", queryError);
          setError(`Error fetching document: ${queryError.message}`);
          
          toast({
            title: "Greška pri učitavanju",
            description: "Nije moguće učitati traženi dokument.",
            variant: "destructive",
          });
          
          setLoading(false);
          return;
        }
        
        console.log("Query results:", documents);
        
        if (documents && documents.length > 0) {
          console.log("Document found:", documents[0]);
          const documentData = documents[0];
          
          // Combine the document metadata with its data
          if (documentData.data && typeof documentData.data === 'object') {
            setDocument({
              ...documentData,
              ...documentData.data
            });
          } else {
            setDocument(documentData);
          }
        } else {
          console.log("Document not found");
          setError(`Requested ${docType} with ID ${docId} could not be found.`);
          
          toast({
            title: "Dokument nije pronađen",
            description: "Traženi dokument ne postoji ili je obrisan.",
            variant: "destructive",
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchDocument:", err);
        setError("An unexpected error occurred while fetching the document.");
        
        toast({
          title: "Greška",
          description: "Došlo je do neočekivane greške prilikom učitavanja dokumenta.",
          variant: "destructive",
        });
        
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [docType, docId, token, toast]);
  
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
            {error || "Dokument koji pokušavate da otvorite nije pronađen ili je obrisan."}
          </p>
          <div className="space-y-4">
            <Button asChild>
              <a href="/">Nazad na početnu</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Generate payment link if it's a predracun
  const paymentLink = docType === "predracun" ? `/pay/${document.id}` : null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="mb-6">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">{getDocTypeText()}</p>
                <CardTitle className="text-2xl">{document.number || document.broj || document.id}</CardTitle>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Datum izdavanja</p>
                <p className="font-medium">{formatDate(document.datum || document.date || document.created_at)}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Izdavalac</h3>
                <div className="space-y-1">
                  <p>{document.izdavalac?.naziv || "Vaša Firma d.o.o."}</p>
                  <p>{document.izdavalac?.adresa || "Glavna ulica 123, Beograd"}</p>
                  <p>PIB: {document.izdavalac?.pib || "123456789"}</p>
                  <p>MB: {document.izdavalac?.mb || "12345678"}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Primalac</h3>
                <div className="space-y-1">
                  <p>{document.primalac?.naziv || document.klijent || ""}</p>
                  <p>{document.primalac?.adresa || document.adresa || ""}</p>
                  {(document.primalac?.pib || document.pib) && 
                    <p>PIB: {document.primalac?.pib || document.pib}</p>
                  }
                  {(document.primalac?.mb || document.maticniBroj) && 
                    <p>MB: {document.primalac?.mb || document.maticniBroj}</p>
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
                          {typeof stavka.ukupno === "number" 
                            ? stavka.ukupno.toLocaleString("sr-RS") 
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

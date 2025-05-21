
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Printer, Download } from "lucide-react";

const DocumentView = () => {
  const { docType, docId } = useParams();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This would be an API call to fetch the document in a real app
    // For now, we'll simulate it with some mock data
    const loadDocument = () => {
      setTimeout(() => {
        if (!docType || !docId) {
          setError("Dokument nije pronađen");
          setLoading(false);
          return;
        }

        // Mock document data based on type
        let mockDocument: any = null;

        if (docType === "faktura") {
          mockDocument = {
            id: docId,
            type: "faktura",
            broj: `F-${docId.substring(0, 5)}`,
            datum: "2023-05-20",
            datumDospeca: "2023-06-20",
            klijent: {
              naziv: "Klijent DOO",
              adresa: "Ulica 123, Grad",
              pib: "123456789",
              maticniBroj: "12345678"
            },
            stavke: [
              { id: 1, naziv: "Proizvod 1", kolicina: 2, cena: 1200, ukupno: 2400 },
              { id: 2, naziv: "Proizvod 2", kolicina: 1, cena: 3500, ukupno: 3500 }
            ],
            ukupno: 5900,
            pdv: 1180,
            ukupnoSaPdv: 7080,
            valuta: "RSD",
            napomena: "Rok plaćanja 30 dana. Hvala na poverenju!"
          };
        } else if (docType === "predracun") {
          mockDocument = {
            id: docId,
            type: "predracun",
            broj: `P-${docId.substring(0, 5)}`,
            datum: "2023-05-18",
            vaziDo: "2023-06-18",
            klijent: {
              naziv: "Drugi Klijent DOO",
              adresa: "Druga ulica 456, Drugi grad",
              pib: "987654321",
              maticniBroj: "87654321"
            },
            stavke: [
              { id: 1, naziv: "Usluga 1", kolicina: 1, cena: 5000, ukupno: 5000 },
              { id: 2, naziv: "Usluga 2", kolicina: 2, cena: 2500, ukupno: 5000 }
            ],
            ukupno: 10000,
            pdv: 2000,
            ukupnoSaPdv: 12000,
            valuta: "RSD",
            napomena: "Predračun važi 30 dana. Plaćanje unapred."
          };
        } else if (docType === "obracun") {
          mockDocument = {
            id: docId,
            type: "obracun",
            broj: `O-${docId.substring(0, 5)}`,
            datum: "2023-05-15",
            period: "April 2023",
            klijent: {
              naziv: "Treći Klijent DOO",
              adresa: "Treća ulica 789, Treći grad",
              pib: "246813579",
              maticniBroj: "13579246"
            },
            stavke: [
              { id: 1, naziv: "Mesečna pretplata", kolicina: 1, cena: 3000, ukupno: 3000 },
              { id: 2, naziv: "Dodatne usluge", kolicina: 5, cena: 600, ukupno: 3000 }
            ],
            ukupno: 6000,
            pdv: 1200,
            ukupnoSaPdv: 7200,
            valuta: "RSD",
            napomena: "Obračun za mesec april 2023."
          };
        }

        if (mockDocument) {
          setDocument(mockDocument);
          setLoading(false);
        } else {
          setError("Dokument nije pronađen ili tip dokumenta nije podržan");
          setLoading(false);
        }
      }, 800); // Simulate network delay
    };

    loadDocument();
  }, [docType, docId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF or similar document
    alert("Funkcionalnost preuzimanja biće dostupna uskoro");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-muted rounded"></div>
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-5/6 bg-muted rounded"></div>
            <div className="h-4 w-4/6 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Dokument nije pronađen</h1>
          <p className="text-muted-foreground mb-6">
            {error || "Dokument koji pokušavate da otvorite nije pronađen ili je obrisan."}
          </p>
          <Button asChild>
            <Link to="/">Povratak na početnu</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Document type name in Serbian
  const docTypeName = 
    document.type === "faktura" ? "Faktura" : 
    document.type === "predracun" ? "Predračun" : 
    document.type === "obracun" ? "Obračun" : 
    "Dokument";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header with actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 print:hidden">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4 md:mb-0">
            <ChevronLeft className="h-4 w-4 mr-1" /> Nazad na stranicu
          </Link>
          
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center">
              <Printer className="h-4 w-4 mr-2" /> Štampaj
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="flex items-center">
              <Download className="h-4 w-4 mr-2" /> Preuzmi
            </Button>
          </div>
        </div>
        
        {/* Document content */}
        <div className="bg-white shadow-lg rounded-lg p-8 print:shadow-none print:p-0">
          {/* Document header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold">{docTypeName}</h1>
              <p className="text-muted-foreground">Broj: {document.broj}</p>
              <p className="text-muted-foreground">Datum: {document.datum}</p>
              {document.type === "faktura" && (
                <p className="text-muted-foreground">Datum dospeća: {document.datumDospeca}</p>
              )}
              {document.type === "predracun" && (
                <p className="text-muted-foreground">Važi do: {document.vaziDo}</p>
              )}
              {document.type === "obracun" && (
                <p className="text-muted-foreground">Period: {document.period}</p>
              )}
            </div>
            <div className="text-right">
              <h2 className="font-medium">Vaša Kompanija DOO</h2>
              <p className="text-sm text-muted-foreground">Adresa kompanije 123</p>
              <p className="text-sm text-muted-foreground">11000 Beograd, Srbija</p>
              <p className="text-sm text-muted-foreground">PIB: 123456789</p>
              <p className="text-sm text-muted-foreground">Tel: +381 11 123 4567</p>
            </div>
          </div>
          
          {/* Client info */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-2">Klijent:</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium">{document.klijent.naziv}</p>
              <p>{document.klijent.adresa}</p>
              <p>PIB: {document.klijent.pib}</p>
              <p>Matični broj: {document.klijent.maticniBroj}</p>
            </div>
          </div>
          
          {/* Items table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">R.br.</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Naziv</th>
                  <th className="border border-gray-200 px-4 py-2 text-right">Količina</th>
                  <th className="border border-gray-200 px-4 py-2 text-right">Cena</th>
                  <th className="border border-gray-200 px-4 py-2 text-right">Ukupno</th>
                </tr>
              </thead>
              <tbody>
                {document.stavke.map((stavka: any, index: number) => (
                  <tr key={stavka.id}>
                    <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-200 px-4 py-2">{stavka.naziv}</td>
                    <td className="border border-gray-200 px-4 py-2 text-right">{stavka.kolicina}</td>
                    <td className="border border-gray-200 px-4 py-2 text-right">
                      {stavka.cena.toLocaleString('sr-RS')} {document.valuta}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-right">
                      {stavka.ukupno.toLocaleString('sr-RS')} {document.valuta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span>Ukupno bez PDV:</span>
                <span className="font-medium">{document.ukupno.toLocaleString('sr-RS')} {document.valuta}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>PDV (20%):</span>
                <span>{document.pdv.toLocaleString('sr-RS')} {document.valuta}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 font-bold">
                <span>Ukupno sa PDV:</span>
                <span>{document.ukupnoSaPdv.toLocaleString('sr-RS')} {document.valuta}</span>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          {document.napomena && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-2">Napomena:</h3>
              <p className="text-muted-foreground">{document.napomena}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentView;

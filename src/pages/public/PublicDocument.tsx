
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PublicDocument = () => {
  const { docType, docId } = useParams();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching document
    const fetchDocument = () => {
      setLoading(true);
      setError(null);

      try {
        // For faktura documents, check localStorage for invoice data
        if (docType === "faktura") {
          const invoices = localStorage.getItem("invoices");
          if (invoices) {
            const parsedInvoices = JSON.parse(invoices);
            const foundInvoice = parsedInvoices.find((inv: any) => inv.id === docId);
            if (foundInvoice) {
              setDocument(foundInvoice);
              return;
            }
          }
        }

        // For predracun documents
        if (docType === "predracun") {
          const quotations = localStorage.getItem("quotations");
          if (quotations) {
            const parsedQuotations = JSON.parse(quotations);
            const foundQuotation = parsedQuotations.find((q: any) => q.id === docId);
            if (foundQuotation) {
              setDocument(foundQuotation);
              return;
            }
          }
        }

        // If no document found
        setError("Document not found");
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("An error occurred while fetching the document");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [docType, docId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-2">Loading document...</h2>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-lg">
          <h2 className="text-2xl font-bold mb-2">Document not found</h2>
          <p className="text-muted-foreground mb-6">
            The document you're trying to access does not exist or has been deleted.
          </p>
          <Button asChild>
            <a href="/">Return Home</a>
          </Button>
        </div>
      </div>
    );
  }

  // Document type specific rendering
  const renderDocumentContent = () => {
    switch (docType) {
      case "faktura":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">Faktura</h1>
                <p className="text-lg">Broj: {document.invoiceNumber}</p>
                <p className="text-muted-foreground">Datum: {document.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">Rok plaćanja:</p>
                <p>{document.dueDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border p-4 rounded-md">
                <h3 className="font-bold mb-2">Izdavalac:</h3>
                <p>{document.companyName || "Vaša Kompanija"}</p>
                <p>{document.companyAddress || "Adresa kompanije"}</p>
                <p>PIB: {document.companyPib || "123456789"}</p>
                <p>Matični broj: {document.companyId || "12345678"}</p>
              </div>

              <div className="border p-4 rounded-md">
                <h3 className="font-bold mb-2">Klijent:</h3>
                <p>{document.clientName}</p>
                <p>{document.clientAddress}</p>
                <p>PIB: {document.clientPib || "N/A"}</p>
              </div>
            </div>

            {/* Items table */}
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3">Red. br.</th>
                    <th className="p-3">Opis</th>
                    <th className="p-3 text-right">Količina</th>
                    <th className="p-3 text-right">Cena</th>
                    <th className="p-3 text-right">Iznos</th>
                  </tr>
                </thead>
                <tbody>
                  {document.items && document.items.map((item: any, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">{parseFloat(item.price).toLocaleString('sr-RS')} RSD</td>
                      <td className="p-3 text-right">{(parseFloat(item.price) * parseFloat(item.quantity)).toLocaleString('sr-RS')} RSD</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted">
                  <tr>
                    <td colSpan={4} className="p-3 text-right font-bold">Ukupno bez PDV-a:</td>
                    <td className="p-3 text-right font-bold">{parseFloat(document.subtotal || "0").toLocaleString('sr-RS')} RSD</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="p-3 text-right font-bold">PDV ({document.taxRate || 20}%):</td>
                    <td className="p-3 text-right font-bold">{parseFloat(document.taxAmount || "0").toLocaleString('sr-RS')} RSD</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="p-3 text-right font-bold">Ukupno sa PDV-om:</td>
                    <td className="p-3 text-right font-bold">{parseFloat(document.total || "0").toLocaleString('sr-RS')} RSD</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment details */}
            <div className="border p-4 rounded-md">
              <h3 className="font-bold mb-2">Podaci za plaćanje:</h3>
              <p>Tekući račun: {document.bankAccount || "123-4567890-12"}</p>
              <p>Poziv na broj: {document.referenceNumber || document.invoiceNumber}</p>
              <p>Svrha uplate: Plaćanje po fakturi br. {document.invoiceNumber}</p>
            </div>

            {/* Notes */}
            {document.notes && (
              <div className="border p-4 rounded-md">
                <h3 className="font-bold mb-2">Napomene:</h3>
                <p>{document.notes}</p>
              </div>
            )}
          </div>
        );

      case "predracun":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">Predračun</h1>
                <p className="text-lg">Broj: {document.quotationNumber}</p>
                <p className="text-muted-foreground">Datum: {document.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">Važi do:</p>
                <p>{document.validUntil}</p>
              </div>
            </div>

            {/* Similar structure to invoice but with predracun specific fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border p-4 rounded-md">
                <h3 className="font-bold mb-2">Izdavalac:</h3>
                <p>{document.companyName || "Vaša Kompanija"}</p>
                <p>{document.companyAddress || "Adresa kompanije"}</p>
                <p>PIB: {document.companyPib || "123456789"}</p>
              </div>

              <div className="border p-4 rounded-md">
                <h3 className="font-bold mb-2">Klijent:</h3>
                <p>{document.clientName}</p>
                <p>{document.clientAddress}</p>
                <p>PIB: {document.clientPib || "N/A"}</p>
              </div>
            </div>

            {/* Items table - similar to invoice */}
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3">Red. br.</th>
                    <th className="p-3">Opis</th>
                    <th className="p-3 text-right">Količina</th>
                    <th className="p-3 text-right">Cena</th>
                    <th className="p-3 text-right">Iznos</th>
                  </tr>
                </thead>
                <tbody>
                  {document.items && document.items.map((item: any, index: number) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">{parseFloat(item.price).toLocaleString('sr-RS')} RSD</td>
                      <td className="p-3 text-right">{(parseFloat(item.price) * parseFloat(item.quantity)).toLocaleString('sr-RS')} RSD</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted">
                  <tr>
                    <td colSpan={4} className="p-3 text-right font-bold">Ukupno bez PDV-a:</td>
                    <td className="p-3 text-right font-bold">{parseFloat(document.subtotal || "0").toLocaleString('sr-RS')} RSD</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="p-3 text-right font-bold">PDV ({document.taxRate || 20}%):</td>
                    <td className="p-3 text-right font-bold">{parseFloat(document.taxAmount || "0").toLocaleString('sr-RS')} RSD</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="p-3 text-right font-bold">Ukupno sa PDV-om:</td>
                    <td className="p-3 text-right font-bold">{parseFloat(document.total || "0").toLocaleString('sr-RS')} RSD</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment info and notes similar to invoice */}
            <div className="border p-4 rounded-md">
              <h3 className="font-bold mb-2">Podaci za plaćanje:</h3>
              <p>Tekući račun: {document.bankAccount || "123-4567890-12"}</p>
              <p>Poziv na broj: {document.referenceNumber || document.quotationNumber}</p>
              <p>Svrha uplate: Plaćanje po predračunu br. {document.quotationNumber}</p>
            </div>

            {document.notes && (
              <div className="border p-4 rounded-md">
                <h3 className="font-bold mb-2">Napomene:</h3>
                <p>{document.notes}</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center">
            <p>Unknown document type</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-card shadow-lg rounded-lg p-6 md:p-8">
          {renderDocumentContent()}

          <div className="mt-8 text-center">
            <Button onClick={() => window.print()} variant="outline">
              Štampaj dokument
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDocument;

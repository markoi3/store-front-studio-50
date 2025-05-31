
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const FaktureFixed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const storeId = user?.store?.id;

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['documents', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching documents:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!storeId,
  });

  const handleViewDocument = (doc: any) => {
    const docType = doc.type;
    const docId = doc.id;
    const token = doc.public_access_token;
    
    // Open in new tab
    const url = `/${docType}/${docId}${token ? `?token=${token}` : ''}`;
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS');
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('sr-RS')} RSD`;
  };

  // Helper function to safely get data from document
  const getDocumentData = (doc: any) => {
    const data = doc.data as any;
    return {
      iznos: data?.iznos || 0,
      klijent: data?.klijent || data?.primalac?.naziv || 'Nepoznat klijent',
      napomena: data?.napomena || null
    };
  };

  if (error) {
    toast.error("Greška pri učitavanju dokumenata");
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fakture</h1>
            <p className="text-muted-foreground">
              Upravljajte fakturama, predračunima i obračunima
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/racunovodstvo/nova-faktura")}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Faktura
            </Button>
            <Button variant="outline" onClick={() => navigate("/racunovodstvo/novi-predracun")}>
              <Plus className="h-4 w-4 mr-2" />
              Novi Predračun
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse">Učitavanje dokumenata...</div>
          </div>
        ) : documents && documents.length > 0 ? (
          <div className="grid gap-4">
            {documents.map((doc) => {
              const docData = getDocumentData(doc);
              return (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-lg">
                          {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} #{doc.number || doc.id.substring(0, 8)}
                        </CardTitle>
                        <CardDescription>
                          Kreiran: {formatDate(doc.created_at)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-medium">
                        {docData.iznos ? formatCurrency(docData.iznos) : 'N/A'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(doc)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Prikaži
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {docData.klijent}
                    </div>
                    {docData.napomena && (
                      <div className="text-sm mt-1">
                        {docData.napomena}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Nema dokumenata</p>
              <p className="text-muted-foreground mb-6">
                Kreirajte svoju prvku fakturu ili predračun
              </p>
              <div className="flex gap-2">
                <Button onClick={() => navigate("/racunovodstvo/nova-faktura")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Faktura
                </Button>
                <Button variant="outline" onClick={() => navigate("/racunovodstvo/novi-predracun")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novi Predračun
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default FaktureFixed;

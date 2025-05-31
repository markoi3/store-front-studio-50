
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Calculator, TrendingUp, Receipt, Building, BarChart3, DollarSign, CheckCircle, XCircle, Percent } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const Racunovodstvo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const storeId = user?.store?.id;

  // Fetch documents and financial stats
  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ['documents-stats', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('store_id', storeId);

      if (error) {
        console.error("Error fetching documents:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!storeId,
  });

  // Calculate stats from documents
  const calculateStats = () => {
    if (!documents) return null;
    
    const fakture = documents.filter(doc => doc.type === 'faktura');
    const predracuni = documents.filter(doc => doc.type === 'predracun');
    
    const paidFakture = fakture.filter(doc => (doc.data as any)?.status === 'paid').length;
    const unpaidFakture = fakture.length - paidFakture;
    
    const totalRevenue = documents.reduce((sum, doc) => {
      const amount = (doc.data as any)?.iznos || 0;
      return sum + amount;
    }, 0);
    
    const estimatedTax = totalRevenue * 0.20; // 20% PDV
    
    return {
      totalRevenue,
      estimatedTax,
      paidFakture,
      unpaidFakture,
      totalFakture: fakture.length,
      totalPredracuni: predracuni.length
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('sr-RS')} RSD`;
  };

  const sections = [
    {
      title: "Izveštaji",
      items: [
        {
          title: "Bilans uspeha (P&L)",
          description: "Dinamički P&L izveštaj sa kalkulatorom profita i gubitka",
          icon: <TrendingUp className="h-6 w-6" />,
          action: () => navigate("/racunovodstvo/pl-report"),
          color: "bg-green-500"
        },
        {
          title: "Bilans stanja",
          description: "Dinamički bilans stanja sa kalkulatorom aktive i pasive",
          icon: <BarChart3 className="h-6 w-6" />,
          action: () => navigate("/racunovodstvo/balance-sheet"),
          color: "bg-blue-500"
        }
      ]
    },
    {
      title: "Dokumenti",
      items: [
        {
          title: "Fakture",
          description: "Kreiranje i upravljanje fakturama",
          icon: <FileText className="h-6 w-6" />,
          action: () => navigate("/racunovodstvo/fakture"),
          color: "bg-blue-500"
        },
        {
          title: "Nova faktura",
          description: "Kreiraj novu fakturu za kupca",
          icon: <Receipt className="h-6 w-6" />,
          action: () => navigate("/racunovodstvo/nova-faktura"),
          color: "bg-green-500"
        },
        {
          title: "Novi predračun",
          description: "Kreiraj predračun za potencijalnog klijenta",
          icon: <Calculator className="h-6 w-6" />,
          action: () => navigate("/racunovodstvo/novi-predracun"),
          color: "bg-yellow-500"
        },
        {
          title: "Novi obračun",
          description: "Kreiraj obračun za izvršene usluge",
          icon: <Building className="h-6 w-6" />,
          action: () => navigate("/racunovodstvo/novi-obracun"),
          color: "bg-purple-500"
        }
      ]
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Računovodstvo</h1>
          <p className="text-muted-foreground">
            Upravljajte finansijama, dokumentima i izveštajima vaše prodavnice
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ukupni prihod</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <div className="text-2xl font-bold">
                  {stats ? formatCurrency(stats.totalRevenue) : 'N/A'}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Procenjeni PDV</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <div className="text-2xl font-bold">
                  {stats ? formatCurrency(stats.estimatedTax) : 'N/A'}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plaćene fakture</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <div className="text-2xl font-bold text-green-600">
                  {stats ? `${stats.paidFakture}/${stats.totalFakture}` : 'N/A'}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Neplaćene fakture</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <div className="text-2xl font-bold text-red-600">
                  {stats ? stats.unpaidFakture : 'N/A'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item, itemIndex) => (
                <Card key={itemIndex} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                    <div className={`p-2 rounded-md ${item.color} text-white mr-3`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {item.description}
                    </CardDescription>
                    <Button onClick={item.action} className="w-full">
                      Otvori
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Racunovodstvo;


import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Calculator, TrendingUp, Receipt, CreditCard, Building, BarChart3 } from "lucide-react";

const Racunovodstvo = () => {
  const navigate = useNavigate();

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
    },
    {
      title: "Finansije",
      items: [
        {
          title: "Transakcije",
          description: "Pregled svih finansijskih transakcija",
          icon: <CreditCard className="h-6 w-6" />,
          action: () => navigate("/racunovodstvo/transakcije"),
          color: "bg-indigo-500"
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

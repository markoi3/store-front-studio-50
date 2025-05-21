
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import {
  FileText,
  Download,
  Plus,
  Filter,
  AlertCircle,
  FileCheck,
  FileClock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Podaci o fakturama
const fakturePodaci = [
  {
    id: "FAK-2023-001",
    tip: "faktura",
    datum: "2023-11-10",
    rokPlacanja: "2023-11-25",
    klijent: "Tehnomanija d.o.o.",
    iznos: 35600,
    pdv: 5933.33,
    status: "plaćeno",
  },
  {
    id: "PR-2023-001",
    tip: "predračun",
    datum: "2023-11-05",
    rokPlacanja: "2023-12-05",
    klijent: "Milan Petrović PR",
    iznos: 18500,
    pdv: 3083.33,
    status: "čeka uplatu",
  },
  {
    id: "FAK-2023-002",
    tip: "faktura",
    datum: "2023-11-15",
    rokPlacanja: "2023-11-30",
    klijent: "Petrović Consulting",
    iznos: 45000,
    pdv: 7500,
    status: "čeka uplatu",
  },
  {
    id: "FAK-2023-003",
    tip: "faktura",
    datum: "2023-10-25",
    rokPlacanja: "2023-11-10",
    klijent: "Gradska Biblioteka",
    iznos: 28400,
    pdv: 0, // oslobođeni PDV
    status: "plaćeno",
  },
  {
    id: "PR-2023-002",
    tip: "predračun",
    datum: "2023-11-20",
    rokPlacanja: "2023-12-20",
    klijent: "Web Studio d.o.o.",
    iznos: 64000,
    pdv: 10666.67,
    status: "poslato",
  },
];

const Fakture = () => {
  const [period, setPeriod] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [tip, setTip] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("sve");

  // Filtriranje faktura
  const filtriraneStavke = fakturePodaci.filter((faktura) => {
    // Filter po tipu (faktura/predračun)
    const tipMatch = tip === "all" || faktura.tip === tip;
    
    // Filter po statusu
    const statusMatch = status === "all" || faktura.status === status;
    
    // Filter po periodu
    const periodMatch = period === "all" || (() => {
      const date = new Date(faktura.datum);
      const now = new Date();
      if (period === "tekući-mesec") {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }
      if (period === "prethodni-mesec") {
        const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const prevMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return date.getMonth() === prevMonth && date.getFullYear() === prevMonthYear;
      }
      if (period === "tekuća-godina") {
        return date.getFullYear() === now.getFullYear();
      }
      return true;
    })();
    
    // Filter po pretrazi (ime klijenta ili ID fakture)
    const searchMatch = search === "" || 
      faktura.klijent.toLowerCase().includes(search.toLowerCase()) ||
      faktura.id.toLowerCase().includes(search.toLowerCase());
    
    // Filter po aktivnom tabu
    const tabMatch = activeTab === "sve" || 
      (activeTab === "fakture" && faktura.tip === "faktura") || 
      (activeTab === "predračuni" && faktura.tip === "predračun");
    
    return tipMatch && statusMatch && periodMatch && searchMatch && tabMatch;
  });

  // Ukupni iznosi za filtrirane stavke
  const ukupanIznos = filtriraneStavke.reduce((sum, faktura) => sum + faktura.iznos, 0);
  const ukupanPDV = filtriraneStavke.reduce((sum, faktura) => sum + faktura.pdv, 0);
  const ukupnoBezPDV = ukupanIznos - ukupanPDV;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Fakture i predračuni</h1>
          <div className="flex flex-wrap gap-2">
            <Link to="/fakture/nova">
              <Button variant="default">
                <FileText className="mr-2 h-4 w-4" />
                Nova faktura
              </Button>
            </Link>
            <Link to="/predracun/novi">
              <Button variant="outline">
                <FileClock className="mr-2 h-4 w-4" />
                Novi predračun
              </Button>
            </Link>
          </div>
        </div>

        {/* Kartice pregleda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ukupan iznos</CardTitle>
              <CardDescription>Za prikazani period</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-numeric font-bold">
                {ukupanIznos.toLocaleString("sr-RS")} RSD
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Bez PDV-a</CardTitle>
              <CardDescription>Osnovica</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-numeric font-bold">
                {ukupnoBezPDV.toLocaleString("sr-RS")} RSD
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">PDV iznos</CardTitle>
              <CardDescription>Za prikazani period</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-numeric font-bold">
                {ukupanPDV.toLocaleString("sr-RS")} RSD
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabovi i filteri */}
        <Tabs defaultValue="sve" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="sve">Sve</TabsTrigger>
              <TabsTrigger value="fakture">Fakture</TabsTrigger>
              <TabsTrigger value="predračuni">Predračuni</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-wrap gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Svi periodi</SelectItem>
                  <SelectItem value="tekući-mesec">Tekući mesec</SelectItem>
                  <SelectItem value="prethodni-mesec">Prethodni mesec</SelectItem>
                  <SelectItem value="tekuća-godina">Tekuća godina</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Svi statusi</SelectItem>
                  <SelectItem value="plaćeno">Plaćeno</SelectItem>
                  <SelectItem value="čeka uplatu">Čeka uplatu</SelectItem>
                  <SelectItem value="poslato">Poslato</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Pretraži po klijentu ili broju"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tabela faktura */}
          <TabsContent value={activeTab}>
            <div className="bg-card shadow-sm rounded-lg overflow-hidden border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Broj</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Klijent</TableHead>
                    <TableHead>Iznos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Akcije</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtriraneStavke.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <AlertCircle className="h-12 w-12 opacity-20 mb-2" />
                          <p>Nema pronađenih faktura ili predračuna</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtriraneStavke.map((faktura) => (
                      <TableRow key={faktura.id}>
                        <TableCell className="font-medium">{faktura.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {faktura.tip === "faktura" ? (
                              <FileCheck className="h-4 w-4 mr-1 text-blue-500" />
                            ) : (
                              <FileClock className="h-4 w-4 mr-1 text-amber-500" />
                            )}
                            <span className="capitalize">
                              {faktura.tip === "faktura" ? "Faktura" : "Predračun"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{faktura.datum}</TableCell>
                        <TableCell>{faktura.klijent}</TableCell>
                        <TableCell className="font-numeric">
                          {faktura.iznos.toLocaleString("sr-RS")} RSD
                        </TableCell>
                        <TableCell>
                          <span
                            className={`py-1 px-2 rounded-full text-xs ${
                              faktura.status === "plaćeno"
                                ? "bg-green-100 text-green-800"
                                : faktura.status === "čeka uplatu"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {faktura.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" /> PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Fakture;

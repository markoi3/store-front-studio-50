
import { useState, useEffect, useCallback } from "react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";
import {
  Calculator,
  FileText,
  Plus,
  AlertCircle,
  Download,
  BarChart3,
  TrendingUp,
  DollarSign,
  Receipt,
  BookOpen,
  FileSpreadsheet,
  PieChart,
  Target,
  Building2,
  Coins
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for initial obračuni
const initialObracuni = [
  {
    id: "OBR-2023-001",
    tip: "obračun",
    naziv: "Oktobar 2023",
    period: "oktobar",
    godina: "2023",
    datum: "2023-11-01",
    ukupanPromet: 120000,
    stopa: "20",
    osnovica: 100000,
    pdvIznos: 20000,
    porezNaDobit: 15000,
    ukupanPorez: 35000
  },
  {
    id: "OBR-2023-002",
    tip: "obračun",
    naziv: "Treći kvartal 2023",
    period: "kvartal3",
    godina: "2023",
    datum: "2023-10-05",
    ukupanPromet: 380000,
    stopa: "20",
    osnovica: 316666.67,
    pdvIznos: 63333.33,
    porezNaDobit: 47500,
    ukupanPorez: 110833.33
  }
];

// Mock data for KPIs
const mockKPIs = {
  ukupniPrihodi: 850000,
  ukupniRashodi: 620000,
  nettoProfit: 230000,
  brojPorudzbina: 156,
  najboljiProizvod: "Gaming laptop",
  profitMarza: 27.1
};

// Mock data for profit/loss
const mockProfitLoss = {
  prihodi: [
    { naziv: "Prodaja proizvoda", iznos: 850000 },
    { naziv: "Ostalo", iznos: 15000 }
  ],
  troskovi: [
    { naziv: "Nabavka robe", iznos: 450000 },
    { naziv: "Marketing i reklame", iznos: 85000 },
    { naziv: "Poštarina i dostava", iznos: 35000 },
    { naziv: "Internet i hosting", iznos: 12000 },
    { naziv: "Knjigovođa", iznos: 38000 }
  ]
};

const Racunovodstvo = () => {
  const [godina, setGodina] = useState<string>(new Date().getFullYear().toString());
  const [period, setPeriod] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [obracuni, setObracuni] = useState(initialObracuni);
  const [activeTab, setActiveTab] = useState("pregled");
  const { toast } = useToast();
  const location = useLocation();

  const loadObracuni = useCallback(() => {
    try {
      const storedObracuni = localStorage.getItem("obracuni");
      
      let allObracuni = [...initialObracuni];
      
      if (storedObracuni) {
        const parsedObracuni = JSON.parse(storedObracuni);
        allObracuni = [...allObracuni, ...parsedObracuni];
      }
      
      setObracuni(allObracuni);
    } catch (error) {
      console.error("Error loading stored obracuni:", error);
    }
  }, []);

  // Load stored items and check for success message on page load
  useEffect(() => {
    loadObracuni();
    
    if (location.state?.success) {
      toast({
        title: "Uspešno",
        description: location.state.message || "Operacija je uspešno izvršena",
      });
      // Clear the state after showing toast
      window.history.replaceState({}, document.title);
    }
  }, [location, toast, loadObracuni]);

  const filtriraniObracuni = obracuni.filter(obracun => {
    // Filter po godini
    const godinaMatch = godina === "all" || obracun.godina === godina;
    
    // Filter po periodu
    const periodMatch = period === "all" || obracun.period === period;
    
    // Filter po pretrazi
    const searchMatch = search === "" || 
      obracun.naziv.toLowerCase().includes(search.toLowerCase()) ||
      obracun.id.toLowerCase().includes(search.toLowerCase());
    
    return godinaMatch && periodMatch && searchMatch;
  });

  // Ukupan PDV i porez na dobit za filtrirane obračune
  const ukupanPDV = filtriraniObracuni.reduce((sum, obracun) => sum + (obracun.pdvIznos || 0), 0);
  const ukupanPorezNaDobit = filtriraniObracuni.reduce((sum, obracun) => sum + (obracun.porezNaDobit || 0), 0);
  const ukupanPorez = ukupanPDV + ukupanPorezNaDobit;

  // Generate unique years for filter select
  const godine = Array.from(
    new Set([...obracuni.map(o => o.godina), new Date().getFullYear().toString()])
  ).sort((a, b) => parseInt(b) - parseInt(a));

  const handleExportPDF = () => {
    toast({
      title: "Izvoz u toku",
      description: "PDF izvoz je pokrenut i biće spreman za preuzimanje.",
    });
  };

  const handleExportXML = () => {
    toast({
      title: "Izvoz u toku", 
      description: "XML izvoz je pokrenut i biće spreman za preuzimanje.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Računovodstvo</h1>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExportPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Izvezi PDF
            </Button>
            <Button onClick={handleExportXML} variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Izvezi XML
            </Button>
            <Link to="/obracun/novi">
              <Button variant="default">
                <Calculator className="mr-2 h-4 w-4" />
                Novi obračun poreza
              </Button>
            </Link>
            <Link to="/fakture">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Fakture i predračuni
              </Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="pregled">KPI Dashboard</TabsTrigger>
            <TabsTrigger value="bilans-uspeha">P&L Izveštaj</TabsTrigger>
            <TabsTrigger value="bilans-stanja">Bilans stanja</TabsTrigger>
            <TabsTrigger value="obrasci">Obrasci</TabsTrigger>
            <TabsTrigger value="knjige">Knjige</TabsTrigger>
            <TabsTrigger value="obracuni">Obračuni</TabsTrigger>
          </TabsList>

          {/* KPI Dashboard */}
          <TabsContent value="pregled" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                    Ukupni prihodi
                  </CardTitle>
                  <CardDescription>Za tekuću godinu</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-numeric font-bold text-green-600">
                    {mockKPIs.ukupniPrihodi.toLocaleString("sr-RS")} RSD
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Receipt className="mr-2 h-5 w-5 text-red-600" />
                    Ukupni rashodi
                  </CardTitle>
                  <CardDescription>Za tekuću godinu</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-numeric font-bold text-red-600">
                    {mockKPIs.ukupniRashodi.toLocaleString("sr-RS")} RSD
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                    Netto profit
                  </CardTitle>
                  <CardDescription>Za tekuću godinu</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-numeric font-bold text-blue-600">
                    {mockKPIs.nettoProfit.toLocaleString("sr-RS")} RSD
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Target className="mr-2 h-5 w-5 text-purple-600" />
                    Broj porudžbina
                  </CardTitle>
                  <CardDescription>Za tekuću godinu</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-numeric font-bold text-purple-600">
                    {mockKPIs.brojPorudzbina}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <PieChart className="mr-2 h-5 w-5 text-orange-600" />
                    Profit marža
                  </CardTitle>
                  <CardDescription>Prosečna marža</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-numeric font-bold text-orange-600">
                    {mockKPIs.profitMarza}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Coins className="mr-2 h-5 w-5 text-yellow-600" />
                    Najbolji proizvod
                  </CardTitle>
                  <CardDescription>Po profitabilnosti</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-yellow-600">
                    {mockKPIs.najboljiProizvod}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profit & Loss Report */}
          <TabsContent value="bilans-uspeha" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">Prihodi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockProfitLoss.prihodi.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.naziv}</span>
                        <span className="font-medium text-green-600">
                          {item.iznos.toLocaleString("sr-RS")} RSD
                        </span>
                      </div>
                    ))}
                    <div className="pt-3 border-t">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Ukupno prihodi</span>
                        <span className="text-green-600">
                          {mockProfitLoss.prihodi.reduce((sum, item) => sum + item.iznos, 0).toLocaleString("sr-RS")} RSD
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-red-600">Troškovi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockProfitLoss.troskovi.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.naziv}</span>
                        <span className="font-medium text-red-600">
                          {item.iznos.toLocaleString("sr-RS")} RSD
                        </span>
                      </div>
                    ))}
                    <div className="pt-3 border-t">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Ukupno troškovi</span>
                        <span className="text-red-600">
                          {mockProfitLoss.troskovi.reduce((sum, item) => sum + item.iznos, 0).toLocaleString("sr-RS")} RSD
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Netto rezultat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {(mockProfitLoss.prihodi.reduce((sum, item) => sum + item.iznos, 0) - 
                      mockProfitLoss.troskovi.reduce((sum, item) => sum + item.iznos, 0)).toLocaleString("sr-RS")} RSD
                  </p>
                  <p className="text-muted-foreground mt-2">
                    {((mockProfitLoss.prihodi.reduce((sum, item) => sum + item.iznos, 0) - 
                      mockProfitLoss.troskovi.reduce((sum, item) => sum + item.iznos, 0)) / 
                      mockProfitLoss.prihodi.reduce((sum, item) => sum + item.iznos, 0) * 100).toFixed(1)}% marža
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Balance Sheet */}
          <TabsContent value="bilans-stanja" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Aktiva</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Gotovina u banci</span>
                      <span className="font-medium">250.000 RSD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zalihe</span>
                      <span className="font-medium">180.000 RSD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potraživanja</span>
                      <span className="font-medium">75.000 RSD</span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Ukupna aktiva</span>
                        <span>505.000 RSD</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pasiva</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Obaveze prema dobavljačima</span>
                      <span className="font-medium">120.000 RSD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Poreski dugovi</span>
                      <span className="font-medium">45.000 RSD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Osnovni kapital</span>
                      <span className="font-medium">340.000 RSD</span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Ukupna pasiva</span>
                        <span>505.000 RSD</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Forms */}
          <TabsContent value="obrasci" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Obrazac POPDV
                  </CardTitle>
                  <CardDescription>Poreska prijava za PDV</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Kreiraj POPDV
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Building2 className="mr-2 h-5 w-5" />
                    Obrazac PPP-PD
                  </CardTitle>
                  <CardDescription>Prijava poreza na dobit</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Kreiraj PPP-PD
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calculator className="mr-2 h-5 w-5" />
                    Ostali obrasci
                  </CardTitle>
                  <CardDescription>Dodatni poreski obrasci</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Pogledaj sve
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Books */}
          <TabsContent value="knjige" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-green-600" />
                    Knjiga izlaznih faktura
                  </CardTitle>
                  <CardDescription>Evidencija prodaje</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Broj faktura ovaj mesec:</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ukupan promet:</span>
                      <span className="font-medium">125.000 RSD</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Izvezi knjgu
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-red-600" />
                    Knjiga ulaznih faktura
                  </CardTitle>
                  <CardDescription>Evidencija nabavki</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Broj faktura ovaj mesec:</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ukupni troškovi:</span>
                      <span className="font-medium">45.000 RSD</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Izvezi knjgu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tax Calculations */}
          <TabsContent value="obracuni" className="space-y-6">
            {/* Kartice pregleda */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ukupan PDV</CardTitle>
                  <CardDescription>Za izabrani period</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-numeric font-bold">
                    {ukupanPDV.toLocaleString("sr-RS")} RSD
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Porez na dobit</CardTitle>
                  <CardDescription>Za izabrani period</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-numeric font-bold">
                    {ukupanPorezNaDobit.toLocaleString("sr-RS")} RSD
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ukupno poreza</CardTitle>
                  <CardDescription>Svi porezi</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-numeric font-bold">
                    {ukupanPorez.toLocaleString("sr-RS")} RSD
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filteri */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <Select value={godina} onValueChange={setGodina}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Godina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Sve godine</SelectItem>
                    {godine.map(g => (
                      <SelectItem key={g} value={g}>{g}.</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Svi periodi</SelectItem>
                    <SelectItem value="januar">Januar</SelectItem>
                    <SelectItem value="februar">Februar</SelectItem>
                    <SelectItem value="mart">Mart</SelectItem>
                    <SelectItem value="april">April</SelectItem>
                    <SelectItem value="maj">Maj</SelectItem>
                    <SelectItem value="jun">Jun</SelectItem>
                    <SelectItem value="jul">Jul</SelectItem>
                    <SelectItem value="avgust">Avgust</SelectItem>
                    <SelectItem value="septembar">Septembar</SelectItem>
                    <SelectItem value="oktobar">Oktobar</SelectItem>
                    <SelectItem value="novembar">Novembar</SelectItem>
                    <SelectItem value="decembar">Decembar</SelectItem>
                    <SelectItem value="kvartal1">Prvi kvartal</SelectItem>
                    <SelectItem value="kvartal2">Drugi kvartal</SelectItem>
                    <SelectItem value="kvartal3">Treći kvartal</SelectItem>
                    <SelectItem value="kvartal4">Četvrti kvartal</SelectItem>
                    <SelectItem value="godina">Cela godina</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Pretraži obračune"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Tabela obračuna */}
            <div className="bg-card shadow-sm rounded-lg overflow-hidden border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID obračuna</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>PDV</TableHead>
                    <TableHead>Porez na dobit</TableHead>
                    <TableHead>Ukupno poreza</TableHead>
                    <TableHead className="text-right">Akcije</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtriraniObracuni.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <AlertCircle className="h-12 w-12 opacity-20 mb-2" />
                          <p>Nema pronađenih obračuna</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtriraniObracuni.map((obracun) => (
                      <TableRow key={obracun.id}>
                        <TableCell className="font-medium">{obracun.id}</TableCell>
                        <TableCell>{obracun.naziv}</TableCell>
                        <TableCell>{obracun.datum}</TableCell>
                        <TableCell className="font-numeric">
                          {obracun.pdvIznos.toLocaleString("sr-RS")} RSD
                        </TableCell>
                        <TableCell className="font-numeric">
                          {obracun.porezNaDobit.toLocaleString("sr-RS")} RSD
                        </TableCell>
                        <TableCell className="font-numeric">
                          {obracun.ukupanPorez.toLocaleString("sr-RS")} RSD
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

export default Racunovodstvo;

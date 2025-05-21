
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
import { Link, useLocation } from "react-router-dom";
import {
  Calculator,
  FileText,
  Plus,
  AlertCircle,
  Download,
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

const Racunovodstvo = () => {
  const [godina, setGodina] = useState<string>(new Date().getFullYear().toString());
  const [period, setPeriod] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [obracuni, setObracuni] = useState(initialObracuni);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Računovodstvo</h1>
          <div className="flex flex-wrap gap-2">
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
      </div>
    </AdminLayout>
  );
};

export default Racunovodstvo;

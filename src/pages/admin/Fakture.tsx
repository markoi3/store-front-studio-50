import { useState, useEffect } from "react";
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  Download,
  Plus,
  AlertCircle,
  FileCheck,
  FileClock,
  Mail,
  Share2,
  Link as LinkIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Initial fake data
let fakturePodaci = [
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

// Function to check local storage for new items
const getStoredItems = () => {
  try {
    const storedFakture = localStorage.getItem("fakture");
    const storedPredracuni = localStorage.getItem("predracuni");
    const storedObracuni = localStorage.getItem("obracuni");
    
    let allItems = [...fakturePodaci];
    
    if (storedFakture) {
      const parsedFakture = JSON.parse(storedFakture);
      allItems = [...allItems, ...parsedFakture];
    }
    
    if (storedPredracuni) {
      const parsedPredracuni = JSON.parse(storedPredracuni);
      allItems = [...allItems, ...parsedPredracuni];
    }
    
    if (storedObracuni) {
      const parsedObracuni = JSON.parse(localStorage.getItem("obracuni") || "[]");
      allItems = [...allItems, ...parsedObracuni];
    }
    
    // Remove duplicates based on id
    const uniqueItems = Array.from(
      new Map(allItems.map(item => [item.id, item])).values()
    );
    
    return uniqueItems;
  } catch (error) {
    console.error("Error loading stored items:", error);
    return fakturePodaci;
  }
};

const Fakture = () => {
  const [period, setPeriod] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [tip, setTip] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("sve");
  const [stavke, setStavke] = useState(fakturePodaci);
  const [emailAddress, setEmailAddress] = useState("");
  const [shareLink, setShareLink] = useState("");
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Load stored items on initial load and when the location changes (user navigates to this page)
  useEffect(() => {
    const allItems = getStoredItems();
    setStavke(allItems);
    
    // Check if we have a success message from another page
    if (location.state?.success) {
      toast({
        title: "Uspešno",
        description: location.state.message || "Operacija je uspešno izvršena",
      });
      
      // Clear the location state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);

  // Save initial data to localStorage to ensure we have data to display
  useEffect(() => {
    if (!localStorage.getItem("fakture")) {
      localStorage.setItem("fakture", JSON.stringify(fakturePodaci));
    }
  }, []);

  // Filtriranje faktura
  const filtriraneStavke = stavke.filter((faktura) => {
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
      (activeTab === "predračuni" && faktura.tip === "predračun") ||
      (activeTab === "obračuni" && faktura.tip === "obračun");
    
    return tipMatch && statusMatch && periodMatch && searchMatch && tabMatch;
  });

  // Ukupni iznosi za filtrirane stavke
  const ukupanIznos = filtriraneStavke.reduce((sum, faktura) => sum + faktura.iznos, 0);
  const ukupanPDV = filtriraneStavke.reduce((sum, faktura) => sum + faktura.pdv, 0);
  const ukupnoBezPDV = ukupanIznos - ukupanPDV;
  
  const handleDownloadPDF = (id: string) => {
    // U stvarnoj implementaciji, ovde bi bio kod za generisanje PDF-a
    toast({
      title: "PDF preuzet",
      description: `Dokument ${id} je uspešno preuzet kao PDF`,
    });
  };
  
  const handleSendEmail = (id: string, email: string) => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Greška",
        description: "Molimo unesite ispravnu email adresu",
        variant: "destructive",
      });
      return;
    }
    
    // U stvarnoj implementaciji, ovde bi bio kod za slanje emaila
    toast({
      title: "Email poslat",
      description: `Dokument ${id} je uspešno poslat na ${email}`,
    });
  };

  const handleShareLink = (docType: string, id: string) => {
    const publicUrl = `${window.location.origin}/public/${docType}/${id}`;
    setShareLink(publicUrl);
    
    // Copy to clipboard
    navigator.clipboard.writeText(publicUrl).then(() => {
      toast({
        title: "Link kopiran",
        description: "Javni link je kopiran u clipboard",
      });
    });
  };

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
              <TabsTrigger value="obračuni">Obračuni</TabsTrigger>
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
                            ) : faktura.tip === "predracun" ? (
                              <FileClock className="h-4 w-4 mr-1 text-amber-500" />
                            ) : (
                              <FileText className="h-4 w-4 mr-1 text-green-500" />
                            )}
                            <span className="capitalize">
                              {faktura.tip === "faktura" ? "Faktura" : 
                               faktura.tip === "predracun" ? "Predračun" : "Obračun"}
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
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadPDF(faktura.id)}
                            >
                              <Download className="h-4 w-4 mr-1" /> PDF
                            </Button>
                            
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Mail className="h-4 w-4 mr-1" /> Email
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-72" align="end">
                                <div className="space-y-3">
                                  <h4 className="font-medium">Pošalji email</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Pošaljite {faktura.tip} {faktura.id} kao PDF prilog
                                  </p>
                                  <div className="space-y-2">
                                    <Input
                                      placeholder="Email adresa"
                                      value={emailAddress}
                                      onChange={(e) => setEmailAddress(e.target.value)}
                                    />
                                    <Button 
                                      className="w-full"
                                      onClick={() => handleSendEmail(faktura.id, emailAddress)}
                                    >
                                      <Mail className="h-4 w-4 mr-2" /> Pošalji
                                    </Button>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                            
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4 mr-1" /> Deli
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80" align="end">
                                <div className="space-y-3">
                                  <h4 className="font-medium">Javni link za deljenje</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Kopirajte link do javne stranice {faktura.tip === "faktura" ? "fakture" : 
                                    faktura.tip === "predracun" ? "predračuna" : "obračuna"}
                                  </p>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <Input
                                        value={shareLink || `${window.location.origin}/public/${faktura.tip}/${faktura.id}`}
                                        readOnly
                                      />
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="ml-2"
                                        onClick={() => handleShareLink(faktura.tip, faktura.id)}
                                      >
                                        <LinkIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <Link to={`/public/${faktura.tip}/${faktura.id}`} target="_blank">
                                      <Button className="w-full">
                                        <Share2 className="h-4 w-4 mr-2" /> Otvori javnu stranicu
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
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

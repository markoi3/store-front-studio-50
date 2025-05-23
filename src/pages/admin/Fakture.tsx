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
import { Link, useLocation } from "react-router-dom";
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
  Loader2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Initial fake data only used when no documents are available from the database
const initialFakturePodaci = [
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
];

// Define an interface for document data to help with TypeScript
interface DocumentData {
  datum?: string;
  rokPlacanja?: string;
  primalac?: {
    naziv?: string;
  };
  klijent?: string;
  iznos?: number;
  total?: number;
  pdv?: number;
  status?: string;
  [key: string]: any;
}

const Fakture = () => {
  const [period, setPeriod] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [tip, setTip] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("sve");
  const [stavke, setStavke] = useState<any[]>([]);
  const [emailAddress, setEmailAddress] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user?.store?.id) {
        console.log("No store ID available, waiting for authentication");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log(`Fetching documents for store: ${user.store.id}`);
        
        const { data: documents, error: queryError } = await supabase
          .from('documents')
          .select('*')
          .eq('store_id', user.store.id);
        
        if (queryError) {
          console.error("Error fetching documents:", queryError);
          setError(`Error loading documents: ${queryError.message}`);
          toast({
            title: "Greška",
            description: "Došlo je do greške prilikom učitavanja dokumenata.",
            variant: "destructive",
          });
          setStavke([]);
          setIsLoading(false);
          return;
        }

        console.log(`Fetched ${documents?.length || 0} documents`);

        if (documents && documents.length > 0) {
          // Transform database documents to the format expected by the UI
          const transformedDocuments = documents.map(doc => {
            // Safely access nested properties with type checking
            const data = doc.data as DocumentData || {};
            
            return {
              id: doc.number || doc.id,
              tip: doc.type,
              datum: typeof data === 'object' && data.datum ? data.datum : doc.created_at?.split('T')[0],
              rokPlacanja: doc.due_date ? new Date(doc.due_date).toISOString().split('T')[0] : undefined,
              klijent: typeof data === 'object' ? 
                (data.primalac && typeof data.primalac === 'object' ? data.primalac.naziv : null) || 
                data.klijent || 
                "Nepoznat" : "Nepoznat",
              iznos: typeof data === 'object' ? 
                (typeof data.iznos === 'number' ? data.iznos : null) || 
                (typeof data.total === 'number' ? data.total : 0) : 0,
              pdv: typeof data === 'object' && typeof data.pdv === 'number' ? data.pdv : 0,
              status: doc.status || "čeka uplatu",
              public_access_token: doc.public_access_token,
              original: doc // Keep the original document for reference
            };
          });

          console.log("Transformed documents:", transformedDocuments);
          setStavke(transformedDocuments);
        } else {
          console.log("No documents found, using initial data for display purposes");
          // Load default sample data for display when there are no documents
          setStavke(initialFakturePodaci);
        }
      } catch (err) {
        console.error("Unexpected error fetching documents:", err);
        setError("An unexpected error occurred while loading documents.");
        toast({
          title: "Greška",
          description: "Neočekivana greška prilikom učitavanja dokumenata.",
          variant: "destructive",
        });
        setStavke(initialFakturePodaci);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();

    // Check if we have a success message from another page
    if (location.state?.success) {
      toast({
        title: "Uspešno",
        description: location.state.message || "Operacija je uspešno izvršena",
      });
    }
  }, [user, location, toast]);

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

  // Safely format number to locale string
  const formatNumber = (value: any) => {
    if (value === undefined || value === null) {
      return "0";
    }
    
    // Convert to number if it's not already
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    
    // Check if it's a valid number
    if (isNaN(numValue)) {
      return "0";
    }
    
    try {
      return numValue.toLocaleString("sr-RS");
    } catch (error) {
      console.error("Error formatting number:", error);
      return numValue.toString();
    }
  };

  // Ukupni iznosi za filtrirane stavke
  const ukupanIznos = filtriraneStavke.reduce((sum, faktura) => sum + (faktura.iznos || 0), 0);
  const ukupanPDV = filtriraneStavke.reduce((sum, faktura) => sum + (faktura.pdv || 0), 0);
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

  const handleShareLink = (docType: string, id: string, token?: string) => {
    let publicUrl;
    
    if (token) {
      // If we have a token, use that for sharing
      publicUrl = `${window.location.origin}/public/${docType}/${id}?token=${token}`;
    } else {
      // Otherwise just use the ID (though this might not work without auth)
      publicUrl = `${window.location.origin}/public/${docType}/${id}`;
    }
    
    setShareLink(publicUrl);
    
    // Copy to clipboard
    navigator.clipboard.writeText(publicUrl).then(() => {
      toast({
        title: "Link kopiran",
        description: "Javni link je kopiran u clipboard",
      });
    });
  };

  // If there's an error loading documents, show it
  if (error && !isLoading && stavke.length === 0) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Greška prilikom učitavanja dokumenata</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Pokušaj ponovo
          </Button>
        </div>
      </AdminLayout>
    );
  }

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
                {formatNumber(ukupanIznos)} RSD
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
                {formatNumber(ukupnoBezPDV)} RSD
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
                {formatNumber(ukupanPDV)} RSD
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
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin mr-2" />
                  <p>Učitavanje dokumenata...</p>
                </div>
              ) : (
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
                        <TableRow key={faktura.id + (faktura.tip || "")}>
                          <TableCell className="font-medium">{faktura.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {faktura.tip === "faktura" ? (
                                <FileCheck className="h-4 w-4 mr-1 text-blue-500" />
                              ) : faktura.tip === "predračun" ? (
                                <FileClock className="h-4 w-4 mr-1 text-amber-500" />
                              ) : (
                                <FileText className="h-4 w-4 mr-1 text-green-500" />
                              )}
                              <span className="capitalize">
                                {faktura.tip === "faktura" ? "Faktura" : 
                                 faktura.tip === "predračun" ? "Predračun" : "Obračun"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{faktura.datum}</TableCell>
                          <TableCell>{faktura.klijent}</TableCell>
                          <TableCell className="font-numeric">
                            {formatNumber(faktura.iznos)} RSD
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
                                      faktura.tip === "predračun" ? "predračuna" : "obračuna"}
                                    </p>
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <Input
                                          value={shareLink || `${window.location.origin}/public/${faktura.tip}/${faktura.id}${faktura.public_access_token ? `?token=${faktura.public_access_token}` : ''}`}
                                          readOnly
                                        />
                                        <Button 
                                          variant="ghost" 
                                          size="icon"
                                          className="ml-2"
                                          onClick={() => handleShareLink(faktura.tip, faktura.id, faktura.public_access_token)}
                                        >
                                          <LinkIcon className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <Link to={`/public/${faktura.tip}/${faktura.id}${faktura.public_access_token ? `?token=${faktura.public_access_token}` : ''}`} target="_blank">
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
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Fakture;

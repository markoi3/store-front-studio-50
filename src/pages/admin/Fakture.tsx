
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Filter, Search, Printer, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Podaci o fakturama
const fakture = [
  {
    id: "F-2023-001",
    datum: "05.01.2023.",
    klijent: {
      naziv: "Tehnomedia d.o.o.",
      pib: "123456789",
    },
    iznos: 58500,
    status: "plaćeno",
    dueDate: "19.01.2023.",
    brojPorudzbine: "ORD-10045",
  },
  {
    id: "F-2023-002",
    datum: "12.01.2023.",
    klijent: {
      naziv: "Digital Solutions d.o.o.",
      pib: "987654321",
    },
    iznos: 32000,
    status: "neplaćeno",
    dueDate: "26.01.2023.",
    brojPorudzbine: "ORD-10046",
  },
  {
    id: "F-2023-003",
    datum: "18.01.2023.",
    klijent: {
      naziv: "Infotech Systems",
      pib: "456789123",
    },
    iznos: 75000,
    status: "plaćeno",
    dueDate: "01.02.2023.",
    brojPorudzbine: "ORD-10050",
  },
  {
    id: "F-2023-004",
    datum: "25.01.2023.",
    klijent: {
      naziv: "MegaStore Retail",
      pib: "789123456",
    },
    iznos: 42500,
    status: "delimično",
    dueDate: "08.02.2023.",
    brojPorudzbine: "ORD-10055",
  },
  {
    id: "F-2023-005",
    datum: "05.02.2023.",
    klijent: {
      naziv: "WebPro Agency",
      pib: "321654987",
    },
    iznos: 35000,
    status: "neplaćeno",
    dueDate: "19.02.2023.",
    brojPorudzbine: "ORD-10060",
  },
  {
    id: "F-2023-006",
    datum: "15.02.2023.",
    klijent: {
      naziv: "Tehnomedia d.o.o.",
      pib: "123456789",
    },
    iznos: 62000,
    status: "plaćeno",
    dueDate: "01.03.2023.",
    brojPorudzbine: "ORD-10065",
  },
];

const predracuni = [
  {
    id: "P-2023-001",
    datum: "02.01.2023.",
    klijent: {
      naziv: "Nova Firma d.o.o.",
      pib: "111222333",
    },
    iznos: 48000,
    status: "poslato",
    dueDate: "16.01.2023.",
  },
  {
    id: "P-2023-002",
    datum: "10.01.2023.",
    klijent: {
      naziv: "Tech Solutions",
      pib: "444555666",
    },
    iznos: 29500,
    status: "prihvaćeno",
    dueDate: "24.01.2023.",
  },
];

const Fakture = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("fakture");

  const handleDownload = (id: string) => {
    toast({
      title: "Preuzimanje fakture",
      description: `Faktura ${id} se preuzima...`,
    });
  };

  // Filtriranje faktura
  const filtriranjeFakture = activeTab === "fakture" ? fakture : predracuni;
  
  const filtriraniDokumenti = filtriranjeFakture.filter((doc) => {
    const matchesSearch =
      doc.id.toLowerCase().includes(search.toLowerCase()) ||
      doc.klijent.naziv.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    
    // Rudimentarna implementacija filtera perioda
    const matchesPeriod = periodFilter === "all" || doc.datum.includes(periodFilter);
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  // Ukupni iznos filtriranih dokumenata
  const ukupanIznos = filtriraniDokumenti.reduce(
    (sum, doc) => sum + doc.iznos,
    0
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "plaćeno":
        return "bg-green-100 text-green-800";
      case "neplaćeno":
        return "bg-red-100 text-red-800";
      case "delimično":
        return "bg-yellow-100 text-yellow-800";
      case "poslato":
        return "bg-blue-100 text-blue-800";
      case "prihvaćeno":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Fakture</h1>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Nova faktura
          </Button>
        </div>

        {/* Statistike */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ukupan iznos</CardTitle>
              <CardDescription>
                {activeTab === "fakture" ? "Izdate fakture" : "Izdati predračuni"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-numeric font-bold">
                {ukupanIznos.toLocaleString("sr-RS")} RSD
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Neplaćene fakture
              </CardTitle>
              <CardDescription>Ukupan broj</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-numeric font-bold">
                {fakture.filter(f => f.status === "neplaćeno").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Prosečan iznos</CardTitle>
              <CardDescription>Po fakturi</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-numeric font-bold">
                {(ukupanIznos / (filtriraniDokumenti.length || 1)).toLocaleString("sr-RS")} RSD
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabovi i filteri */}
        <Tabs
          defaultValue="fakture"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="fakture" className="min-w-[100px]">
                Fakture
              </TabsTrigger>
              <TabsTrigger value="predracuni" className="min-w-[100px]">
                Predračuni
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Svi statusi</SelectItem>
                    <SelectItem value="plaćeno">Plaćeno</SelectItem>
                    <SelectItem value="neplaćeno">Neplaćeno</SelectItem>
                    <SelectItem value="delimično">Delimično</SelectItem>
                    <SelectItem value="poslato">Poslato</SelectItem>
                    <SelectItem value="prihvaćeno">Prihvaćeno</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={periodFilter}
                  onValueChange={setPeriodFilter}
                >
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Svi periodi</SelectItem>
                    <SelectItem value="01.2023">Januar 2023</SelectItem>
                    <SelectItem value="02.2023">Februar 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pretraži fakture..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <TabsContent value="fakture" className="mt-0">
            <div className="bg-card shadow-sm rounded-lg overflow-hidden border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Broj fakture</TableHead>
                    <TableHead>Datum izdavanja</TableHead>
                    <TableHead>Klijent</TableHead>
                    <TableHead>Iznos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rok plaćanja</TableHead>
                    <TableHead className="text-right">Akcije</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtriraniDokumenti.map((faktura) => (
                    <TableRow key={faktura.id}>
                      <TableCell className="font-medium">{faktura.id}</TableCell>
                      <TableCell>{faktura.datum}</TableCell>
                      <TableCell>
                        <div>
                          <p>{faktura.klijent.naziv}</p>
                          <p className="text-xs text-muted-foreground">
                            PIB: {faktura.klijent.pib}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-numeric">
                        {faktura.iznos.toLocaleString("sr-RS")} RSD
                      </TableCell>
                      <TableCell>
                        <span
                          className={`py-1 px-2 rounded-full text-xs ${getStatusColor(
                            faktura.status
                          )}`}
                        >
                          {faktura.status}
                        </span>
                      </TableCell>
                      <TableCell>{faktura.dueDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Akcije
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownload(faktura.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Preuzmi PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              Štampaj
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Pregledaj
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="predracuni" className="mt-0">
            <div className="bg-card shadow-sm rounded-lg overflow-hidden border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Broj predračuna</TableHead>
                    <TableHead>Datum izdavanja</TableHead>
                    <TableHead>Klijent</TableHead>
                    <TableHead>Iznos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rok</TableHead>
                    <TableHead className="text-right">Akcije</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtriraniDokumenti.map((predracun) => (
                    <TableRow key={predracun.id}>
                      <TableCell className="font-medium">{predracun.id}</TableCell>
                      <TableCell>{predracun.datum}</TableCell>
                      <TableCell>
                        <div>
                          <p>{predracun.klijent.naziv}</p>
                          <p className="text-xs text-muted-foreground">
                            PIB: {predracun.klijent.pib}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-numeric">
                        {predracun.iznos.toLocaleString("sr-RS")} RSD
                      </TableCell>
                      <TableCell>
                        <span
                          className={`py-1 px-2 rounded-full text-xs ${getStatusColor(
                            predracun.status
                          )}`}
                        >
                          {predracun.status}
                        </span>
                      </TableCell>
                      <TableCell>{predracun.dueDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Akcije
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownload(predracun.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Preuzmi PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              Štampaj
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Pregledaj
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
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

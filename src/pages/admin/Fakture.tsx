
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Plus, Search, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Primer podataka za fakture
const faktureData = [
  {
    id: "INV-2023-001",
    client: "Marko Marković",
    date: "2023-06-10",
    dueDate: "2023-06-25",
    total: 35600,
    status: "plaćeno",
    type: "faktura",
  },
  {
    id: "INV-2023-002",
    client: "Jovana Jovanović",
    date: "2023-06-15",
    dueDate: "2023-06-30",
    total: 12400,
    status: "neplaćeno",
    type: "faktura",
  },
  {
    id: "PRO-2023-001",
    client: "Nikola Nikolić",
    date: "2023-06-18",
    dueDate: "2023-07-02",
    total: 24800,
    status: "poslato",
    type: "predračun",
  },
  {
    id: "INV-2023-003",
    client: "Ana Anić",
    date: "2023-06-20",
    dueDate: "2023-07-05",
    total: 18700,
    status: "plaćeno",
    type: "faktura",
  },
  {
    id: "PRO-2023-002",
    client: "Petar Petrović",
    date: "2023-06-22",
    dueDate: "2023-07-07",
    total: 8500,
    status: "prihvaćeno",
    type: "predračun",
  },
];

const Fakture = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState("all");

  // Filtriranje podataka
  const filteredData = faktureData.filter((item) => {
    // Filter po tipu (tab)
    const matchesTab = tab === "all" || item.type === tab;

    // Filter po statusu
    const matchesStatus = filter === "all" || item.status === filter;

    // Filter po pretrazi
    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.client.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "plaćeno":
        return "bg-green-100 text-green-800";
      case "neplaćeno":
        return "bg-red-100 text-red-800";
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Fakture</h1>
          <div className="flex space-x-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova faktura
            </Button>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Novi predračun
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Sve</TabsTrigger>
            <TabsTrigger value="faktura">Fakture</TabsTrigger>
            <TabsTrigger value="predračun">Predračuni</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Pretraži po broju ili klijentu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:w-48">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Svi statusi</SelectItem>
                    <SelectItem value="plaćeno">Plaćeno</SelectItem>
                    <SelectItem value="neplaćeno">Neplaćeno</SelectItem>
                    <SelectItem value="poslato">Poslato</SelectItem>
                    <SelectItem value="prihvaćeno">Prihvaćeno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-custom overflow-hidden border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Broj</TableHead>
                      <TableHead>Tip</TableHead>
                      <TableHead>Klijent</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Rok plaćanja</TableHead>
                      <TableHead>Iznos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="p-4 text-center text-muted-foreground"
                        >
                          Nema pronađenih faktura ili predračuna
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>
                            <span className="capitalize">{item.type}</span>
                          </TableCell>
                          <TableCell>{item.client}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                          <TableCell className="font-numeric">
                            {item.total.toLocaleString("sr-RS")} RSD
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Akcije
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  Pregledaj
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Preuzmi PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Pošalji e-mailom
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Označi kao plaćeno
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faktura" className="space-y-6">
            {/* Sadržaj će biti isti kao za "all", ali filtriran samo za fakture */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Pretraži po broju ili klijentu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:w-48">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Svi statusi</SelectItem>
                    <SelectItem value="plaćeno">Plaćeno</SelectItem>
                    <SelectItem value="neplaćeno">Neplaćeno</SelectItem>
                    <SelectItem value="poslato">Poslato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-custom overflow-hidden border">
              {/* Ista tabela kao gore, samo filtrirana */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Broj</TableHead>
                      <TableHead>Klijent</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Rok plaćanja</TableHead>
                      <TableHead>Iznos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="p-4 text-center text-muted-foreground"
                        >
                          Nema pronađenih faktura
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.client}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                          <TableCell className="font-numeric">
                            {item.total.toLocaleString("sr-RS")} RSD
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Akcije
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  Pregledaj
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Preuzmi PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Pošalji e-mailom
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Označi kao plaćeno
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="predračun" className="space-y-6">
            {/* Sadržaj će biti isti kao za "all", ali filtriran samo za predračune */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Pretraži po broju ili klijentu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:w-48">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Svi statusi</SelectItem>
                    <SelectItem value="prihvaćeno">Prihvaćeno</SelectItem>
                    <SelectItem value="neplaćeno">Neplaćeno</SelectItem>
                    <SelectItem value="poslato">Poslato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-custom overflow-hidden border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Broj</TableHead>
                      <TableHead>Klijent</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Rok važenja</TableHead>
                      <TableHead>Iznos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Akcije</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="p-4 text-center text-muted-foreground"
                        >
                          Nema pronađenih predračuna
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.client}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.dueDate}</TableCell>
                          <TableCell className="font-numeric">
                            {item.total.toLocaleString("sr-RS")} RSD
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Akcije
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  Pregledaj
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Preuzmi PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Pošalji e-mailom
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Konvertuj u fakturu
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Fakture;

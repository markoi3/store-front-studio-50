
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Download, Filter } from "lucide-react";
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

// Podaci o poreskim kalkulacijama
const racunovodstveniPodaci = [
  {
    id: "1001",
    period: "Januar 2023",
    ukupanPromet: 158600,
    pdvIznos: 26433.33,
    porezNaDobit: 13250,
    status: "obračunato",
  },
  {
    id: "1002",
    period: "Februar 2023",
    ukupanPromet: 204350,
    pdvIznos: 34058.33,
    porezNaDobit: 17029.17,
    status: "plaćeno",
  },
  {
    id: "1003",
    period: "Mart 2023",
    ukupanPromet: 178900,
    pdvIznos: 29816.67,
    porezNaDobit: 14908.33,
    status: "obračunato",
  },
  {
    id: "1004",
    period: "April 2023",
    ukupanPromet: 192400,
    pdvIznos: 32066.67,
    porezNaDobit: 16033.33,
    status: "plaćeno",
  },
];

const Racunovodstvo = () => {
  const [period, setPeriod] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filtriranje podataka
  const filtriranPodaci = racunovodstveniPodaci.filter((podatak) => {
    return (
      (statusFilter === "all" || podatak.status === statusFilter) &&
      (period === "all" || podatak.period.includes(period))
    );
  });

  // Ukupan promet za sve filtrirane podatke
  const ukupanPromet = filtriranPodaci.reduce(
    (sum, podatak) => sum + podatak.ukupanPromet,
    0
  );

  // Ukupan PDV za sve filtrirane podatke
  const ukupanPDV = filtriranPodaci.reduce(
    (sum, podatak) => sum + podatak.pdvIznos,
    0
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Računodstvo</h1>
          <Button>
            <Calculator className="mr-2 h-4 w-4" />
            Novi obračun
          </Button>
        </div>

        {/* Kartice pregleda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ukupan promet</CardTitle>
              <CardDescription>Tekuća godina</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-numeric font-bold">
                {ukupanPromet.toLocaleString("sr-RS")} RSD
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ukupan PDV</CardTitle>
              <CardDescription>Tekuća godina</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-numeric font-bold">
                {ukupanPDV.toLocaleString("sr-RS")} RSD
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Poreska stopa</CardTitle>
              <CardDescription>Trenutna</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-numeric font-bold">20%</p>
            </CardContent>
          </Card>
        </div>

        {/* Filteri */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi periodi</SelectItem>
                <SelectItem value="Januar">Januar</SelectItem>
                <SelectItem value="Februar">Februar</SelectItem>
                <SelectItem value="Mart">Mart</SelectItem>
                <SelectItem value="April">April</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi statusi</SelectItem>
                <SelectItem value="obračunato">Obračunato</SelectItem>
                <SelectItem value="plaćeno">Plaćeno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Input placeholder="Pretraži po periodu ili ID-u" />
          </div>
        </div>

        {/* Tabela sa podacima */}
        <div className="bg-card shadow-sm rounded-lg overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Ukupan promet</TableHead>
                <TableHead>PDV iznos</TableHead>
                <TableHead>Porez na dobit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtriranPodaci.map((podatak) => (
                <TableRow key={podatak.id}>
                  <TableCell className="font-medium">{podatak.id}</TableCell>
                  <TableCell>{podatak.period}</TableCell>
                  <TableCell className="font-numeric">
                    {podatak.ukupanPromet.toLocaleString("sr-RS")} RSD
                  </TableCell>
                  <TableCell className="font-numeric">
                    {podatak.pdvIznos.toLocaleString("sr-RS")} RSD
                  </TableCell>
                  <TableCell className="font-numeric">
                    {podatak.porezNaDobit.toLocaleString("sr-RS")} RSD
                  </TableCell>
                  <TableCell>
                    <span
                      className={`py-1 px-2 rounded-full text-xs ${
                        podatak.status === "plaćeno"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {podatak.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" /> Preuzmi
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Racunovodstvo;


import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  FileCheck, 
  CreditCard, 
  Package, 
  Truck, 
  CalendarDays,
  Receipt,
  Download
} from "lucide-react";

// Mock data for transactions
const mockTransakcije = [
  {
    id: "TRX-2023-001",
    datum: "2023-11-15",
    iznos: 12500,
    status: "završeno",
    metoda: "kartica",
    tip: "kupovina",
    kupac: {
      ime: "Marko Petrović",
      email: "marko@example.com",
      telefon: "064-1234-567",
      adresa: "Bulevar kralja Aleksandra 73, Beograd"
    },
    proizvodi: [
      { naziv: "Smartphone XYZ", kolicina: 1, cena: 12500, ukupno: 12500 }
    ],
    napomena: "Standardna isporuka u roku od 3 radna dana",
    faktura: "FAK-2023-002",
    datumIsporuke: "2023-11-18"
  },
  {
    id: "TRX-2023-002",
    datum: "2023-11-20",
    iznos: 8300,
    status: "u obradi",
    metoda: "tekući račun",
    tip: "kupovina",
    kupac: {
      ime: "Jovana Nikolić",
      email: "jovana@example.com",
      telefon: "061-7654-321",
      adresa: "Tržni centar BB, Novi Sad"
    },
    proizvodi: [
      { naziv: "Bežične slušalice", kolicina: 1, cena: 5800, ukupno: 5800 },
      { naziv: "USB kabl", kolicina: 2, cena: 1250, ukupno: 2500 }
    ],
    napomena: "Hitna isporuka",
    faktura: "FAK-2023-003",
    datumIsporuke: "2023-11-22"
  }
];

const Transakcije = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transakcija, setTransakcija] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call or data fetch with a delay
    const fetchTransakcija = async () => {
      setLoading(true);
      
      try {
        // In a real application, this would be an API call
        // For now, we'll just search the mock data or create a placeholder
        setTimeout(() => {
          const found = mockTransakcije.find(t => t.id === id);
          
          if (found) {
            setTransakcija(found);
          } else {
            // Create a placeholder if not found
            setTransakcija({
              id: id || "UNKNOWN-ID",
              datum: new Date().toISOString().split('T')[0],
              iznos: 0,
              status: "nepoznato",
              metoda: "nepoznato",
              tip: "kupovina",
              kupac: {
                ime: "Korisnik",
                email: "info@example.com",
                telefon: "N/A",
                adresa: "N/A"
              },
              proizvodi: [],
              napomena: "Podaci o transakciji nisu pronađeni",
              faktura: "N/A",
              datumIsporuke: "N/A"
            });
          }
          
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Greška pri učitavanju transakcije:", error);
        setLoading(false);
      }
    };

    fetchTransakcija();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Učitavanje transakcije...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!transakcija) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <p className="text-xl text-muted-foreground mb-4">Transakcija nije pronađena</p>
          <Button onClick={() => navigate("/orders")}>
            Nazad na sve porudžbine
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "završeno":
        return "bg-green-100 text-green-800";
      case "u obradi":
        return "bg-blue-100 text-blue-800";
      case "otkazano":
        return "bg-red-100 text-red-800";
      case "na čekanju":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transakcija {transakcija.id}</h1>
            <p className="text-muted-foreground">
              Datum: {transakcija.datum} · Status: 
              <span 
                className={`ml-2 py-1 px-2 rounded-full text-xs ${getStatusBadgeClass(transakcija.status)}`}
              >
                {transakcija.status}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/orders")}>
              Nazad na porudžbine
            </Button>
            <Button variant="outline">
              <Receipt className="mr-2 h-4 w-4" /> Preuzmi fakturu
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" /> Detalji plaćanja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Iznos:</span>
                <span className="font-medium">{transakcija.iznos.toLocaleString("sr-RS")} RSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metoda plaćanja:</span>
                <span className="capitalize">{transakcija.metoda}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Faktura:</span>
                <span>{transakcija.faktura}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" /> Proizvodi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transakcija.proizvodi.length > 0 ? (
                  transakcija.proizvodi.map((proizvod: any, index: number) => (
                    <div key={index} className="border-b pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between">
                        <span>{proizvod.naziv}</span>
                        <span>{proizvod.kolicina} x {proizvod.cena.toLocaleString("sr-RS")} RSD</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Nema proizvoda za prikaz</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" /> Isporuka
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Datum isporuke:</span>
                <span>{transakcija.datumIsporuke}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adresa:</span>
                <span className="text-right">{transakcija.kupac.adresa}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Napomena:</span>
                <span className="text-right max-w-[70%]">{transakcija.napomena}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Podaci o kupcu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Ime i prezime</p>
                <p className="font-medium">{transakcija.kupac.ime}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">E-mail adresa</p>
                <p className="font-medium">{transakcija.kupac.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Telefon</p>
                <p className="font-medium">{transakcija.kupac.telefon}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Adresa</p>
                <p className="font-medium">{transakcija.kupac.adresa}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalji porudžbine</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proizvod</TableHead>
                  <TableHead className="text-right">Količina</TableHead>
                  <TableHead className="text-right">Cena</TableHead>
                  <TableHead className="text-right">Ukupno</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transakcija.proizvodi.length > 0 ? (
                  transakcija.proizvodi.map((proizvod: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{proizvod.naziv}</TableCell>
                      <TableCell className="text-right">{proizvod.kolicina}</TableCell>
                      <TableCell className="text-right">{proizvod.cena.toLocaleString("sr-RS")} RSD</TableCell>
                      <TableCell className="text-right">{proizvod.ukupno.toLocaleString("sr-RS")} RSD</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      Nema proizvoda za prikaz
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <div className="mt-6 space-y-2">
              <Separator />
              <div className="flex justify-between pt-4">
                <span>Ukupno:</span>
                <span className="font-bold">{transakcija.iznos.toLocaleString("sr-RS")} RSD</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Transakcije;

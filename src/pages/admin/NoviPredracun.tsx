
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NoviPredracun = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [predracunData, setPredracunData] = useState({
    broj: "",
    datum: new Date().toISOString().split("T")[0],
    vaziDo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    klijent: "",
    adresa: "",
    pib: "",
    maticniBroj: "",
    napomena: "",
  });
  
  const [stavke, setStavke] = useState([
    { id: 1, opis: "", kolicina: 1, cena: 0, pdvStopa: 20, ukupno: 0 },
  ]);

  const updateStavka = (id: number, field: string, value: string | number) => {
    setStavke(
      stavke.map((stavka) => {
        if (stavka.id === id) {
          const updatedStavka = { ...stavka, [field]: value };
          // Automatski izračunaj ukupno ako se promenila količina ili cena
          if (field === "kolicina" || field === "cena") {
            const kolicina = field === "kolicina" ? Number(value) : stavka.kolicina;
            const cena = field === "cena" ? Number(value) : stavka.cena;
            updatedStavka.ukupno = kolicina * cena;
          }
          return updatedStavka;
        }
        return stavka;
      })
    );
  };

  const dodajStavku = () => {
    const newId = Math.max(...stavke.map((s) => s.id)) + 1;
    setStavke([...stavke, { id: newId, opis: "", kolicina: 1, cena: 0, pdvStopa: 20, ukupno: 0 }]);
  };

  const obrisiStavku = (id: number) => {
    if (stavke.length > 1) {
      setStavke(stavke.filter((s) => s.id !== id));
    } else {
      toast({
        title: "Upozorenje",
        description: "Predračun mora imati najmanje jednu stavku",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPredracunData({ ...predracunData, [name]: value });
  };

  const ukupnoBezPDV = stavke.reduce((sum, stavka) => sum + stavka.ukupno, 0);
  const ukupanPDV = stavke.reduce(
    (sum, stavka) => sum + stavka.ukupno * (stavka.pdvStopa / 100),
    0
  );
  const ukupnoSaPDV = ukupnoBezPDV + ukupanPDV;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulacija slanja podataka na server
    setTimeout(() => {
      console.log("Kreiran predračun:", {
        ...predracunData,
        stavke,
        ukupnoBezPDV,
        ukupanPDV,
        ukupnoSaPDV,
      });
      
      setIsSubmitting(false);
      toast({
        title: "Uspešno",
        description: "Predračun je kreiran",
      });
      navigate("/fakture");
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Novi predračun</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Podaci o predračunu */}
            <Card>
              <CardHeader>
                <CardTitle>Podaci o predračunu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="broj">Broj predračuna</Label>
                    <Input
                      id="broj"
                      name="broj"
                      placeholder="PR-2023-001"
                      value={predracunData.broj}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="datum">Datum izdavanja</Label>
                    <Input
                      id="datum"
                      name="datum"
                      type="date"
                      value={predracunData.datum}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaziDo">Važi do</Label>
                  <Input
                    id="vaziDo"
                    name="vaziDo"
                    type="date"
                    value={predracunData.vaziDo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="napomena">Napomena</Label>
                  <Textarea
                    id="napomena"
                    name="napomena"
                    placeholder="Dodatne napomene za predračun"
                    value={predracunData.napomena}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Podaci o klijentu */}
            <Card>
              <CardHeader>
                <CardTitle>Podaci o klijentu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="klijent">Naziv klijenta</Label>
                  <Input
                    id="klijent"
                    name="klijent"
                    placeholder="Naziv firme / Ime i prezime"
                    value={predracunData.klijent}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresa">Adresa</Label>
                  <Input
                    id="adresa"
                    name="adresa"
                    placeholder="Ulica i broj, mesto"
                    value={predracunData.adresa}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pib">PIB</Label>
                    <Input
                      id="pib"
                      name="pib"
                      placeholder="PIB"
                      value={predracunData.pib}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maticniBroj">Matični broj</Label>
                    <Input
                      id="maticniBroj"
                      name="maticniBroj"
                      placeholder="Matični broj"
                      value={predracunData.maticniBroj}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stavke predračuna */}
          <Card>
            <CardHeader>
              <CardTitle>Stavke predračuna</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Zaglavlje tabele */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 py-2 px-4 bg-muted rounded-md">
                <div className="md:col-span-5">
                  <Label>Opis</Label>
                </div>
                <div className="md:col-span-1">
                  <Label>Količina</Label>
                </div>
                <div className="md:col-span-2">
                  <Label>Cena (RSD)</Label>
                </div>
                <div className="md:col-span-1">
                  <Label>PDV %</Label>
                </div>
                <div className="md:col-span-2">
                  <Label>Ukupno (RSD)</Label>
                </div>
                <div className="md:col-span-1"></div>
              </div>

              {/* Stavke */}
              {stavke.map((stavka) => (
                <div
                  key={stavka.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 py-2 px-4 border border-border rounded-md"
                >
                  <div className="md:col-span-5">
                    <Label className="md:hidden">Opis</Label>
                    <Input
                      placeholder="Opis proizvoda ili usluge"
                      value={stavka.opis}
                      onChange={(e) => updateStavka(stavka.id, "opis", e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Label className="md:hidden">Količina</Label>
                    <Input
                      type="number"
                      min="1"
                      value={stavka.kolicina}
                      onChange={(e) => updateStavka(stavka.id, "kolicina", Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="md:hidden">Cena (RSD)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={stavka.cena}
                      onChange={(e) => updateStavka(stavka.id, "cena", Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Label className="md:hidden">PDV %</Label>
                    <Select
                      value={stavka.pdvStopa.toString()}
                      onValueChange={(value) => updateStavka(stavka.id, "pdvStopa", Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="md:hidden">Ukupno (RSD)</Label>
                    <Input
                      type="number"
                      value={stavka.ukupno}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => obrisiStavku(stavka.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={dodajStavku}>
                <Plus className="mr-2 h-4 w-4" /> Dodaj stavku
              </Button>

              {/* Ukupno */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-7"></div>
                  <div className="md:col-span-5">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Ukupno bez PDV-a:</Label>
                        <span className="font-medium">
                          {ukupnoBezPDV.toLocaleString("sr-RS")} RSD
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <Label>PDV:</Label>
                        <span className="font-medium">
                          {ukupanPDV.toLocaleString("sr-RS")} RSD
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <Label className="font-bold">Ukupno za plaćanje:</Label>
                        <span className="font-bold text-lg">
                          {ukupnoSaPDV.toLocaleString("sr-RS")} RSD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/fakture")}
            >
              Otkaži
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Čuvanje..." : "Sačuvaj predračun"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NoviPredracun;

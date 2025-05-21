
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  CardDescription,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NoviObracun = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const [obracunData, setObracunData] = useState({
    period: "",
    godina: new Date().getFullYear().toString(),
    ukupanPromet: "",
    stopa: "20",
  });

  const [rezultati, setRezultati] = useState<{
    pdvIznos: number | null;
    porezNaDobit: number | null;
    osnovica: number | null;
  }>({
    pdvIznos: null,
    porezNaDobit: null,
    osnovica: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setObracunData({ ...obracunData, [name]: value });
    
    // Resetuj rezultate kada se promeni bilo koji input
    setRezultati({
      pdvIznos: null,
      porezNaDobit: null,
      osnovica: null,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setObracunData({ ...obracunData, [name]: value });
    
    // Resetuj rezultate kada se promeni bilo koji select
    setRezultati({
      pdvIznos: null,
      porezNaDobit: null,
      osnovica: null,
    });
  };

  const izracunajPoreze = () => {
    setIsCalculating(true);
    
    // Simulacija izračunavanja sa malim odlaganjem
    setTimeout(() => {
      const promet = parseFloat(obracunData.ukupanPromet) || 0;
      const stopa = parseFloat(obracunData.stopa) || 20;
      
      // Izračunaj osnovicu (promet bez PDV-a)
      const osnovica = promet / (1 + stopa / 100);
      
      // Izračunaj PDV
      const pdvIznos = promet - osnovica;
      
      // Izračunaj porez na dobit (15% od osnovice u Srbiji)
      const porezNaDobit = osnovica * 0.15;
      
      setRezultati({
        pdvIznos,
        porezNaDobit,
        osnovica,
      });
      
      setIsCalculating(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rezultati.pdvIznos === null) {
      toast({
        title: "Upozorenje",
        description: "Morate prvo izračunati poreze",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    // Simulacija slanja podataka na server
    setTimeout(() => {
      console.log("Kreiran obračun:", {
        ...obracunData,
        ...rezultati,
      });
      
      setIsSubmitting(false);
      toast({
        title: "Uspešno",
        description: "Obračun je kreiran",
      });
      navigate("/racunovodstvo");
    }, 1000);
  };

  const periodi = [
    { id: "januar", name: "Januar" },
    { id: "februar", name: "Februar" },
    { id: "mart", name: "Mart" },
    { id: "april", name: "April" },
    { id: "maj", name: "Maj" },
    { id: "jun", name: "Jun" },
    { id: "jul", name: "Jul" },
    { id: "avgust", name: "Avgust" },
    { id: "septembar", name: "Septembar" },
    { id: "oktobar", name: "Oktobar" },
    { id: "novembar", name: "Novembar" },
    { id: "decembar", name: "Decembar" },
    { id: "kvartal1", name: "Prvi kvartal" },
    { id: "kvartal2", name: "Drugi kvartal" },
    { id: "kvartal3", name: "Treći kvartal" },
    { id: "kvartal4", name: "Četvrti kvartal" },
    { id: "godina", name: "Cela godina" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Novi obračun poreza</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Podaci za obračun</CardTitle>
                <CardDescription>
                  Unesite podatke za period za koji želite da izračunate poreze
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="period">Period</Label>
                    <Select
                      value={obracunData.period}
                      onValueChange={(value) => handleSelectChange("period", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Izaberite period" />
                      </SelectTrigger>
                      <SelectContent>
                        {periodi.map((period) => (
                          <SelectItem key={period.id} value={period.id}>
                            {period.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="godina">Godina</Label>
                    <Input
                      id="godina"
                      name="godina"
                      type="number"
                      min="2000"
                      max="2050"
                      value={obracunData.godina}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ukupanPromet">Ukupan promet (RSD)</Label>
                  <Input
                    id="ukupanPromet"
                    name="ukupanPromet"
                    type="number"
                    step="0.01"
                    min="0"
                    value={obracunData.ukupanPromet}
                    onChange={handleInputChange}
                    required
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stopa">Poreska stopa (%)</Label>
                  <Select
                    value={obracunData.stopa}
                    onValueChange={(value) => handleSelectChange("stopa", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Izaberite stopu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Opšta stopa PDV-a u Srbiji je 20%
                  </p>
                </div>

                <Button
                  type="button"
                  className="w-full mt-4"
                  onClick={izracunajPoreze}
                  disabled={!obracunData.ukupanPromet || isCalculating}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  {isCalculating ? "Izračunavanje..." : "Izračunaj poreze"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rezultati obračuna</CardTitle>
                <CardDescription>
                  Pregled izračunatih poreza na osnovu unetih podataka
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <Label>Osnovica:</Label>
                    <span className={`text-lg font-medium ${rezultati.osnovica !== null ? "" : "text-muted-foreground"}`}>
                      {rezultati.osnovica !== null
                        ? `${rezultati.osnovica.toLocaleString("sr-RS")} RSD`
                        : "---"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b">
                    <Label>PDV ({obracunData.stopa}%):</Label>
                    <span className={`text-lg font-medium ${rezultati.pdvIznos !== null ? "" : "text-muted-foreground"}`}>
                      {rezultati.pdvIznos !== null
                        ? `${rezultati.pdvIznos.toLocaleString("sr-RS")} RSD`
                        : "---"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b">
                    <Label>Porez na dobit (15%):</Label>
                    <span className={`text-lg font-medium ${rezultati.porezNaDobit !== null ? "" : "text-muted-foreground"}`}>
                      {rezultati.porezNaDobit !== null
                        ? `${rezultati.porezNaDobit.toLocaleString("sr-RS")} RSD`
                        : "---"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <Label className="font-bold">Ukupan iznos poreza:</Label>
                    <span className={`text-xl font-bold ${(rezultati.pdvIznos !== null && rezultati.porezNaDobit !== null) ? "text-primary" : "text-muted-foreground"}`}>
                      {(rezultati.pdvIznos !== null && rezultati.porezNaDobit !== null)
                        ? `${(rezultati.pdvIznos + rezultati.porezNaDobit).toLocaleString("sr-RS")} RSD`
                        : "---"}
                    </span>
                  </div>
                </div>
                
                <div className="rounded-lg bg-muted p-4 mt-6">
                  <h4 className="text-sm font-medium mb-2">Napomena</h4>
                  <p className="text-xs text-muted-foreground">
                    Ovo je informativni obračun poreza. Za tačne informacije o poreskim
                    obavezama konsultujte poreskog savetnika ili Poresku upravu Republike Srbije.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/racunovodstvo")}
            >
              Otkaži
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || rezultati.pdvIznos === null}
            >
              {isSubmitting ? "Čuvanje..." : "Sačuvaj obračun"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NoviObracun;

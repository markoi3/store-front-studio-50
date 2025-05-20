
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { CheckIcon, Copy, LinkIcon, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BrziLink = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    naziv: "",
    cena: "",
    opis: "",
    valuta: "RSD",
    rok: "7",
    linkSačuvan: false,
    generisaniLink: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generisiLink = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simuliraj generisanje linka
    const randomId = Math.random().toString(36).substring(2, 10);
    const generisaniLink = `https://axia.rs/pay/${randomId}`;
    
    setFormData((prev) => ({
      ...prev,
      linkSačuvan: true,
      generisaniLink,
    }));
    
    toast({
      title: "Link je uspešno generisan",
      description: "Sada možete da podelite link sa klijentima.",
    });
  };

  const kopirajLink = () => {
    if (formData.generisaniLink) {
      navigator.clipboard.writeText(formData.generisaniLink);
      toast({
        title: "Link kopiran",
        description: "Link je kopiran u clipboard.",
      });
    }
  };

  const resetujFormu = () => {
    setFormData({
      naziv: "",
      cena: "",
      opis: "",
      valuta: "RSD",
      rok: "7",
      linkSačuvan: false,
      generisaniLink: "",
    });
  };

  // Primer prethodno kreiranih linkova
  const prethodniLinkovi = [
    {
      id: "link1",
      naziv: "Konsultacije - 1h",
      cena: "5000",
      datumKreiranja: "15.05.2023.",
      aktivanDo: "15.06.2023.",
      iskorišćen: true,
    },
    {
      id: "link2",
      naziv: "Web dizajn - prva rata",
      cena: "25000",
      datumKreiranja: "20.05.2023.",
      aktivanDo: "20.06.2023.",
      iskorišćen: false,
    },
    {
      id: "link3",
      naziv: "SEO optimizacija",
      cena: "15000",
      datumKreiranja: "01.06.2023.",
      aktivanDo: "01.07.2023.",
      iskorišćen: false,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Brzi link za plaćanje</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Kreiraj novi link</CardTitle>
                <CardDescription>
                  Popunite podatke za brzu stranicu za plaćanje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={generisiLink} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="naziv">Naziv proizvoda/usluge</Label>
                      <Input
                        id="naziv"
                        name="naziv"
                        placeholder="npr. Konsultacija, Proizvod, itd."
                        value={formData.naziv}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cena">Cena</Label>
                        <Input
                          id="cena"
                          name="cena"
                          type="number"
                          placeholder="0.00"
                          value={formData.cena}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="valuta">Valuta</Label>
                        <Select
                          value={formData.valuta}
                          onValueChange={(value) =>
                            handleSelectChange("valuta", value)
                          }
                        >
                          <SelectTrigger id="valuta">
                            <SelectValue placeholder="RSD" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RSD">RSD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="opis">Opis (opciono)</Label>
                    <Textarea
                      id="opis"
                      name="opis"
                      placeholder="Unesite detaljan opis proizvoda ili usluge..."
                      value={formData.opis}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rok">Rok važenja linka</Label>
                    <Select
                      value={formData.rok}
                      onValueChange={(value) => handleSelectChange("rok", value)}
                    >
                      <SelectTrigger id="rok">
                        <SelectValue placeholder="Odaberite rok" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 dana</SelectItem>
                        <SelectItem value="7">7 dana</SelectItem>
                        <SelectItem value="14">14 dana</SelectItem>
                        <SelectItem value="30">30 dana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit">Generiši link</Button>
                  </div>
                </form>
              </CardContent>
              {formData.linkSačuvan && (
                <CardFooter className="flex flex-col space-y-4">
                  <div className="w-full p-4 bg-primary/5 rounded-lg border border-primary/10 flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Vaš link:</h4>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={kopirajLink}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Kopiraj
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-3.5 w-3.5 mr-1" />
                          Podeli
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center p-2 bg-background rounded border">
                      <LinkIcon className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm font-numeric truncate">
                        {formData.generisaniLink}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={resetujFormu}
                  >
                    Kreiraj novi link
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Prethodno kreirani linkovi</CardTitle>
                <CardDescription>Pregled vaših aktivnih linkova</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {prethodniLinkovi.map((link) => (
                  <div
                    key={link.id}
                    className="p-3 border rounded-md flex flex-col space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{link.naziv}</h3>
                      {link.iskorišćen ? (
                        <span className="bg-green-100 text-green-800 text-xs rounded-full px-2 py-0.5 flex items-center">
                          <CheckIcon className="h-3 w-3 mr-1" />
                          Plaćeno
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-0.5">
                          Aktivno
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Cena: {link.cena} RSD</span>
                      <span>Do: {link.aktivanDo}</span>
                    </div>
                    <div className="flex space-x-2 pt-1">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Copy className="h-3 w-3 mr-1" />
                        Kopiraj
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Share2 className="h-3 w-3 mr-1" />
                        Podeli
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BrziLink;

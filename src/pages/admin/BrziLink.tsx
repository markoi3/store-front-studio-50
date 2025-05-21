
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, LinkIcon, Copy, Share2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Load stored links from localStorage or return default empty array
const getStoredLinks = () => {
  try {
    const links = localStorage.getItem("paymentLinks");
    return links ? JSON.parse(links) : [];
  } catch (error) {
    console.error("Error loading payment links:", error);
    return [];
  }
};

// Save links to localStorage
const saveLinks = (links) => {
  localStorage.setItem("paymentLinks", JSON.stringify(links));
};

const BrziLink = () => {
  const { toast } = useToast();
  const [linkId, setLinkId] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [savedLinks, setSavedLinks] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    type: "product",
    paymentMethod: "card",
    expiryDate: "",
  });

  // Load any existing links when component mounts
  useEffect(() => {
    const links = getStoredLinks();
    setSavedLinks(links);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateLink = () => {
    // Generate a unique ID for the link
    const id = `BL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setLinkId(id);
    
    // Create the link object with all necessary data
    const newLink = {
      id: id,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      type: formData.type,
      paymentMethod: formData.paymentMethod,
      expiryDate: formData.expiryDate,
      createdAt: new Date().toISOString(),
      status: "active"
    };
    
    // Add to saved links
    const updatedLinks = [...savedLinks, newLink];
    setSavedLinks(updatedLinks);
    saveLinks(updatedLinks);
    
    // Construct the full link URL
    const baseUrl = window.location.origin;
    const fullLink = `${baseUrl}/pay/${id}`;
    setGeneratedLink(fullLink);
    
    toast({
      title: "Link je uspešno kreiran",
      description: "Možete ga podeliti sa klijentima",
    });
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast({
        title: "Kopirano",
        description: "Link je kopiran u clipboard",
      });
    }
  };

  const shareLink = () => {
    if (navigator.share && generatedLink) {
      navigator.share({
        title: `Plaćanje za: ${formData.name}`,
        text: `Kliknite na link za plaćanje: ${formData.name}`,
        url: generatedLink,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      copyToClipboard();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      type: "product",
      paymentMethod: "card",
      expiryDate: "",
    });
    setLinkId(null);
    setGeneratedLink(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Brzi link</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={resetForm}>
              Novi link
            </Button>
          </div>
        </div>

        <Tabs defaultValue="create">
          <TabsList className="mb-4">
            <TabsTrigger value="create">Kreiraj link</TabsTrigger>
            <TabsTrigger value="history">Istorija linkova</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informacije o proizvodu/usluzi</CardTitle>
                  <CardDescription>
                    Unesite detalje za koje želite da primite uplatu
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Naziv</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Naziv proizvoda ili usluge"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Opis</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Opišite proizvod ili uslugu"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Cena (RSD)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tip</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Izaberite tip" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Proizvod</SelectItem>
                        <SelectItem value="service">Usluga</SelectItem>
                        <SelectItem value="donation">Donacija</SelectItem>
                        <SelectItem value="subscription">Pretplata</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Način plaćanja</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Izaberite način" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Kartica</SelectItem>
                          <SelectItem value="bank">Banka</SelectItem>
                          <SelectItem value="all">Svi načini</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Datum isteka (opciono)</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={generateLink}
                    disabled={!formData.name || !formData.price}
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Generiši brzi link
                  </Button>
                </CardFooter>
              </Card>

              {generatedLink && (
                <Card>
                  <CardHeader>
                    <CardTitle>Vaš brzi link je kreiran</CardTitle>
                    <CardDescription>
                      ID linka: <span className="font-medium">{linkId}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Link za plaćanje</Label>
                      <div className="flex">
                        <Input
                          value={generatedLink}
                          readOnly
                          className="rounded-r-none"
                        />
                        <Button
                          onClick={copyToClipboard}
                          variant="secondary"
                          className="rounded-l-none border-l-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted p-4">
                      <h4 className="mb-2 font-medium">Pregled informacija</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Naziv:</span> {formData.name}
                        </p>
                        {formData.description && (
                          <p>
                            <span className="font-medium">Opis:</span> {formData.description}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Cena:</span> {formData.price} RSD
                        </p>
                        <p>
                          <span className="font-medium">Tip:</span>{" "}
                          {formData.type === "product"
                            ? "Proizvod"
                            : formData.type === "service"
                            ? "Usluga"
                            : formData.type === "donation"
                            ? "Donacija"
                            : "Pretplata"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button
                      onClick={shareLink}
                      className="w-full"
                      variant="default"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Podeli link
                    </Button>
                    <Button
                      onClick={resetForm}
                      className="w-full"
                      variant="outline"
                    >
                      Napravi novi link
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Istorija kreiranih linkova</CardTitle>
                <CardDescription>
                  Pregled svih prethodno kreiranih brzih linkova
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedLinks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <LinkIcon className="mx-auto h-12 w-12 opacity-20 mb-3" />
                    <p>Još uvek nemate kreiranih linkova</p>
                    <Button
                      variant="link"
                      onClick={() => document.querySelector('[value="create"]')?.dispatchEvent(new Event('click'))}
                    >
                      Napravite svoj prvi brzi link
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Naziv</TableHead>
                        <TableHead>Iznos</TableHead>
                        <TableHead>Datum kreiranja</TableHead>
                        <TableHead className="text-right">Akcije</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {savedLinks.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell className="font-medium">{link.id}</TableCell>
                          <TableCell>{link.name}</TableCell>
                          <TableCell>{link.price} RSD</TableCell>
                          <TableCell>{new Date(link.createdAt).toLocaleDateString('sr-RS')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  const url = `${window.location.origin}/pay/${link.id}`;
                                  navigator.clipboard.writeText(url);
                                  toast({ 
                                    title: "Kopirano", 
                                    description: "Link je kopiran u clipboard" 
                                  });
                                }}
                              >
                                <Copy className="h-4 w-4 mr-1" /> Kopiraj
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  window.open(`${window.location.origin}/pay/${link.id}`, '_blank');
                                }}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" /> Otvori
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default BrziLink;

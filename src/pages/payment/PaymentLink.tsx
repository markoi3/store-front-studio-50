
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Check, CreditCard, Share2 } from "lucide-react";

// Simulirani podaci za brzi link
const mockPaymentLinks = [
  {
    id: "BL-A1B2C3",
    name: "Web dizajn - Home page",
    description: "Izrada home page-a za web sajt sa modernim interfejsom",
    price: "15000",
    type: "service",
    paymentMethod: "all",
    expiryDate: "2025-12-31",
  },
  {
    id: "BL-X9Y8Z7",
    name: "Konsultacije - 1h",
    description: "Jednočasovna konsultacija o digitalnom marketingu",
    price: "5000",
    type: "service",
    paymentMethod: "card",
    expiryDate: "",
  }
];

// Schema validacija za karticu
const cardFormSchema = z.object({
  cardNumber: z.string().min(16, "Broj kartice mora imati najmanje 16 cifara"),
  cardName: z.string().min(3, "Ime na kartici je obavezno"),
  expiryDate: z.string().min(5, "Datum isteka je obavezan"),
  cvv: z.string().min(3, "CVV mora imati najmanje 3 cifre"),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

const PaymentLink = () => {
  const { linkId } = useParams();
  const { toast } = useToast();
  const [paymentLink, setPaymentLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Form za kreditnu karticu
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  useEffect(() => {
    // Simulacija učitavanja podataka sa servera
    setTimeout(() => {
      const foundLink = mockPaymentLinks.find(link => link.id === linkId);
      
      if (foundLink) {
        setPaymentLink(foundLink);
      } else {
        toast({
          title: "Greška",
          description: "Link za plaćanje nije pronađen ili je istekao",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    }, 1000);
  }, [linkId, toast]);

  const onSubmit = (data: CardFormValues) => {
    setProcessing(true);
    
    // Simuliraj obradu plaćanja
    setTimeout(() => {
      console.log("Podaci kartice:", data);
      setProcessing(false);
      setPaymentComplete(true);
      
      toast({
        title: "Plaćanje uspešno",
        description: "Vaša transakcija je uspešno obrađena",
      });
    }, 2000);
  };

  // Obradi formatiranje broja kartice
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .match(/.{1,4}/g)
      ?.join(" ")
      .substr(0, 19) || "";
  };
  
  // Obradi formatiranje datuma isteka
  const formatExpiryDate = (value: string) => {
    value = value.replace(/\D/g, "");
    if (value.length >= 2) {
      return `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    return value;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
          </div>
          <p className="text-muted-foreground">Učitavanje detalja plaćanja...</p>
        </div>
      </div>
    );
  }
  
  if (!paymentLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Link nije pronađen</h1>
          <p className="text-gray-600 mb-8">
            Link za plaćanje koji ste pokušali da otvorite nije pronađen ili je istekao.
          </p>
          <Button asChild>
            <a href="/">Nazad na početnu</a>
          </Button>
        </div>
      </div>
    );
  }
  
  if (paymentComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Plaćanje uspešno!</CardTitle>
            <CardDescription>
              Vaša transakcija je uspešno obrađena.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="border-t border-b py-4 my-4">
              <p className="text-muted-foreground mb-1">Plaćeno za</p>
              <p className="font-semibold text-lg">{paymentLink.name}</p>
              <p className="font-bold text-xl mt-2">{Number(paymentLink.price).toLocaleString("sr-RS")} RSD</p>
            </div>
            <p className="text-muted-foreground">
              Potvrda je poslata na vašu email adresu.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <a href="/">Nazad na početnu</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{paymentLink.name}</CardTitle>
          <CardDescription>
            {paymentLink.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-t border-b py-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Iznos</span>
              <span className="font-bold text-xl">{Number(paymentLink.price).toLocaleString("sr-RS")} RSD</span>
            </div>
          </div>
          
          {!showForm ? (
            <Button 
              className="w-full" 
              onClick={() => setShowForm(true)}
              size="lg"
            >
              <CreditCard className="mr-2 h-4 w-4" /> 
              Plati karticom
            </Button>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Broj kartice</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0000 0000 0000 0000"
                          {...field}
                          onChange={(e) => {
                            field.onChange(formatCardNumber(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ime na kartici</FormLabel>
                      <FormControl>
                        <Input placeholder="PETAR PETROVIĆ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Datum isteka</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM/GG" 
                            {...field} 
                            maxLength={5}
                            onChange={(e) => {
                              field.onChange(formatExpiryDate(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="000"
                            {...field}
                            type="password"
                            maxLength={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={processing}
                  size="lg"
                >
                  {processing ? "Procesiranje..." : "Potvrdi plaćanje"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col pt-0">
          <div className="flex items-center justify-center w-full text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <CreditCard className="h-4 w-4" />
              <span>Sigurno plaćanje</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentLink;

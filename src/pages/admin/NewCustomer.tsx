
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const customerSchema = z.object({
  name: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  email: z.string().email("Unesite validnu email adresu"),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const NewCustomer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        zip: "",
        country: "",
      },
    },
  });

  const onSubmit = async (values: CustomerFormValues) => {
    if (!user?.store?.id) {
      toast.error("Niste povezani sa prodavnicom");
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          store_id: user.store.id,
        })
        .select()
        .single();
        
      if (error) {
        if (error.message.includes("duplicate key")) {
          toast.error("Kupac sa ovom email adresom već postoji");
        } else {
          toast.error("Greška pri kreiranju kupca: " + error.message);
        }
        throw error;
      }
      
      toast.success("Kupac je uspešno kreiran");
      navigate("/customers");
    } catch (error) {
      console.error("Error creating customer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dodaj novog kupca</h1>
          <Button variant="outline" onClick={() => navigate("/customers")}>
            Nazad
          </Button>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ime i prezime</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Unesite ime i prezime" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email adresa</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="kupac@gmail.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Broj telefona</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+381 xx xxx xxxx" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ulica i broj</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ulica i broj" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grad</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Grad" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address.zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poštanski broj</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="11000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Država</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Srbija" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/customers")}
                >
                  Otkaži
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Kreiranje..." : "Kreiraj kupca"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewCustomer;

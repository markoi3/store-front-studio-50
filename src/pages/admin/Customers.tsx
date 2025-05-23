
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Plus, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

const Customers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user?.store?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('store_id', user.store.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          toast.error("Failed to load customers: " + error.message);
          throw error;
        }
        
        setCustomers(data || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, [user]);
  
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Kupci</h1>
          <Button onClick={() => navigate("/customers/new")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Dodaj kupca
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pretraži kupce..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-muted rounded-md w-full"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground">
                  Nema pronađenih kupaca
                </h3>
                <p className="text-muted-foreground">
                  Kupci će se pojaviti ovde nakon što izvrše porudžbinu ili ih ručno dodate.
                </p>
                <Button onClick={() => navigate("/customers/new")} className="mt-4">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Dodaj prvog kupca
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ime</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Datum registracije</TableHead>
                    <TableHead className="text-right">Akcije</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name || 'N/A'}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(customer.created_at).toLocaleDateString('sr-RS')}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/customers/${customer.id}`)}
                        >
                          Detalji
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/customers/edit/${customer.id}`)}
                        >
                          Izmeni
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Customers;

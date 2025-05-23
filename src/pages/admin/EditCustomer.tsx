
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define extended customer type with additional fields
interface ExtendedCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: any;
  auth_id?: string;
  store_id: string;
  created_at?: string;
  updated_at?: string;
  company_name?: string;
  tax_id?: string;
  notes?: string;
  birthday?: string;
}

const EditCustomer = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    taxId: '',
    notes: '',
    street: '',
    city: '',
    zip: '',
    country: '',
    birthday: undefined as Date | undefined,
  });
  const [customer, setCustomer] = useState<ExtendedCustomer | null>(null);
  
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!customerId || !user?.store?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .eq('store_id', user.store.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setCustomer(data as ExtendedCustomer);
          
          // Safely extract address data from customer.address
          const address = data?.address ? 
            (typeof data.address === 'string' ? 
              JSON.parse(data.address) : 
              data.address) : 
            {};

          setFormData({
            name: data?.name || '',
            email: data?.email || '',
            phone: data?.phone || '',
            companyName: (data as ExtendedCustomer)?.company_name || '',
            taxId: (data as ExtendedCustomer)?.tax_id || '',
            notes: (data as ExtendedCustomer)?.notes || '',
            street: address?.street || '',
            city: address?.city || '',
            zip: address?.zip || '',
            country: address?.country || '',
            birthday: (data as ExtendedCustomer)?.birthday ? new Date((data as ExtendedCustomer).birthday!) : undefined,
          });
        }
      } catch (error: any) {
        toast.error('Error loading customer: ' + error.message);
        console.error('Error fetching customer:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomer();
  }, [customerId, user?.store?.id]);
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerId || !user?.store?.id) return;
    
    try {
      setLoading(true);
      
      // Prepare address object
      const addressData = {
        street: formData.street,
        city: formData.city,
        zip: formData.zip,
        country: formData.country
      };
      
      // Update customer
      const { error } = await supabase
        .from('customers')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.companyName,
          tax_id: formData.taxId,
          notes: formData.notes,
          address: addressData,
          birthday: formData.birthday?.toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId)
        .eq('store_id', user.store.id);
      
      if (error) throw error;
      
      toast.success('Customer updated successfully');
      navigate('/customers');
    } catch (error: any) {
      toast.error('Error updating customer: ' + error.message);
      console.error('Error updating customer:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Customer</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
              <div className="h-4 w-32 bg-muted rounded"></div>
            </div>
          </div>
        ) : !customer ? (
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">Customer not found</h2>
            <p className="mb-4">The requested customer could not be found or you don't have access to it.</p>
            <Button onClick={() => navigate('/customers')}>Back to Customers</Button>
          </div>
        ) : (
          <Card>
            <form onSubmit={handleFormSubmit}>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthday">Birthday</Label>
                      <Input
                        id="birthday"
                        type="date"
                        value={formData.birthday ? formData.birthday.toISOString().split('T')[0] : ''}
                        onChange={(e) => setFormData({
                          ...formData, 
                          birthday: e.target.value ? new Date(e.target.value) : undefined
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxId">Tax ID / PIB</Label>
                        <Input
                          id="taxId"
                          value={formData.taxId}
                          onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="street">Street</Label>
                        <Input
                          id="street"
                          value={formData.street}
                          onChange={(e) => setFormData({...formData, street: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">Postal Code</Label>
                        <Input
                          id="zip"
                          value={formData.zip}
                          onChange={(e) => setFormData({...formData, zip: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => setFormData({...formData, country: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => navigate('/customers')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditCustomer;

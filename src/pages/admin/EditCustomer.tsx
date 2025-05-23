
// Fix the JSON typing issues by safely accessing the address fields

// Safely extract address data from customer.address
const address = customer?.address ? 
  (typeof customer.address === 'string' ? 
    JSON.parse(customer.address) : 
    customer.address) : 
  {};

setFormData({
  name: customer?.name || '',
  email: customer?.email || '',
  phone: customer?.phone || '',
  companyName: customer?.company_name || '',
  taxId: customer?.tax_id || '',
  notes: customer?.notes || '',
  street: address?.street || '',
  city: address?.city || '',
  zip: address?.zip || '',
  country: address?.country || '',
  birthday: customer?.birthday ? new Date(customer.birthday) : undefined,
});

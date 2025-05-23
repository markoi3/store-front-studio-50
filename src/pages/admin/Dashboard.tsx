
// Fix the TypeScript error in the Dashboard.tsx file
// When passing the number to the formatter, we'll convert it to string:

// Update the currency formatter to accept both string and number
const formatCurrency = (value: string | number) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
  }).format(numValue);
};

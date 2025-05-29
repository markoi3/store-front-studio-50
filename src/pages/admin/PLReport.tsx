
import React, { useState } from 'react';
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PLData {
  revenue: number;
  costOfGoodsSold: number;
  operatingExpenses: {
    salaries: number;
    rent: number;
    utilities: number;
    marketing: number;
    other: number;
  };
  interestExpense: number;
  taxes: number;
}

const PLReport = () => {
  const [period, setPeriod] = useState<string>('monthly');
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [data, setData] = useState<PLData>({
    revenue: 0,
    costOfGoodsSold: 0,
    operatingExpenses: {
      salaries: 0,
      rent: 0,
      utilities: 0,
      marketing: 0,
      other: 0
    },
    interestExpense: 0,
    taxes: 0
  });

  const handleInputChange = (field: string, value: number, category?: string) => {
    if (category === 'operatingExpenses') {
      setData(prev => ({
        ...prev,
        operatingExpenses: {
          ...prev.operatingExpenses,
          [field]: value
        }
      }));
    } else {
      setData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const calculateTotals = () => {
    const grossProfit = data.revenue - data.costOfGoodsSold;
    const totalOperatingExpenses = Object.values(data.operatingExpenses).reduce((sum, val) => sum + val, 0);
    const operatingIncome = grossProfit - totalOperatingExpenses;
    const netIncome = operatingIncome - data.interestExpense - data.taxes;
    
    return {
      grossProfit,
      totalOperatingExpenses,
      operatingIncome,
      netIncome
    };
  };

  const totals = calculateTotals();

  const handleSave = () => {
    // Here you would save to Supabase or local storage
    toast.success("P&L Report saved successfully");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sr-RS', {
      style: 'currency',
      currency: 'RSD'
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bilans uspeha (P&L)</h1>
          <Button onClick={handleSave}>Sačuvaj izveštaj</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="period">Period</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mesečno</SelectItem>
                <SelectItem value="yearly">Godišnje</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="year">Godina</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {period === 'monthly' && (
            <div>
              <Label htmlFor="month">Mesec</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <SelectItem key={m} value={m.toString()}>
                      {new Date(2024, m - 1).toLocaleDateString('sr-RS', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Unos podataka</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="revenue">Prihodi</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={data.revenue}
                  onChange={(e) => handleInputChange('revenue', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="cogs">Troškovi prodatih proizvoda</Label>
                <Input
                  id="cogs"
                  type="number"
                  value={data.costOfGoodsSold}
                  onChange={(e) => handleInputChange('costOfGoodsSold', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div>
                <h4 className="font-medium mb-3">Operativni troškovi</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="salaries">Plate</Label>
                    <Input
                      id="salaries"
                      type="number"
                      value={data.operatingExpenses.salaries}
                      onChange={(e) => handleInputChange('salaries', parseFloat(e.target.value) || 0, 'operatingExpenses')}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rent">Kirija</Label>
                    <Input
                      id="rent"
                      type="number"
                      value={data.operatingExpenses.rent}
                      onChange={(e) => handleInputChange('rent', parseFloat(e.target.value) || 0, 'operatingExpenses')}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="utilities">Režije</Label>
                    <Input
                      id="utilities"
                      type="number"
                      value={data.operatingExpenses.utilities}
                      onChange={(e) => handleInputChange('utilities', parseFloat(e.target.value) || 0, 'operatingExpenses')}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="marketing">Marketing</Label>
                    <Input
                      id="marketing"
                      type="number"
                      value={data.operatingExpenses.marketing}
                      onChange={(e) => handleInputChange('marketing', parseFloat(e.target.value) || 0, 'operatingExpenses')}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="other">Ostali troškovi</Label>
                    <Input
                      id="other"
                      type="number"
                      value={data.operatingExpenses.other}
                      onChange={(e) => handleInputChange('other', parseFloat(e.target.value) || 0, 'operatingExpenses')}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="interest">Kamata na kredite</Label>
                <Input
                  id="interest"
                  type="number"
                  value={data.interestExpense}
                  onChange={(e) => handleInputChange('interestExpense', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="taxes">Porezi</Label>
                <Input
                  id="taxes"
                  type="number"
                  value={data.taxes}
                  onChange={(e) => handleInputChange('taxes', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* P&L Statement */}
          <Card>
            <CardHeader>
              <CardTitle>Bilans uspeha</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Prihodi</span>
                  <span className="font-medium">{formatCurrency(data.revenue)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Troškovi prodatih proizvoda</span>
                  <span className="text-red-600">({formatCurrency(data.costOfGoodsSold)})</span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Bruto dobit</span>
                    <span className={totals.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(totals.grossProfit)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="font-medium">Operativni troškovi:</div>
                  <div className="flex justify-between ml-4">
                    <span>Plate</span>
                    <span>({formatCurrency(data.operatingExpenses.salaries)})</span>
                  </div>
                  <div className="flex justify-between ml-4">
                    <span>Kirija</span>
                    <span>({formatCurrency(data.operatingExpenses.rent)})</span>
                  </div>
                  <div className="flex justify-between ml-4">
                    <span>Režije</span>
                    <span>({formatCurrency(data.operatingExpenses.utilities)})</span>
                  </div>
                  <div className="flex justify-between ml-4">
                    <span>Marketing</span>
                    <span>({formatCurrency(data.operatingExpenses.marketing)})</span>
                  </div>
                  <div className="flex justify-between ml-4">
                    <span>Ostali troškovi</span>
                    <span>({formatCurrency(data.operatingExpenses.other)})</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Ukupni operativni troškovi</span>
                    <span>({formatCurrency(totals.totalOperatingExpenses)})</span>
                  </div>
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Operativni prihod</span>
                    <span className={totals.operatingIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(totals.operatingIncome)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span>Kamata na kredite</span>
                  <span className="text-red-600">({formatCurrency(data.interestExpense)})</span>
                </div>

                <div className="flex justify-between">
                  <span>Porezi</span>
                  <span className="text-red-600">({formatCurrency(data.taxes)})</span>
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Neto dobit</span>
                    <span className={totals.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(totals.netIncome)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PLReport;

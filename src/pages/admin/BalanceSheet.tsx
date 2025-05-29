
import React, { useState } from 'react';
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BalanceSheetData {
  assets: {
    currentAssets: {
      cash: number;
      accountsReceivable: number;
      inventory: number;
      other: number;
    };
    fixedAssets: {
      equipment: number;
      buildings: number;
      land: number;
      other: number;
    };
  };
  liabilities: {
    currentLiabilities: {
      accountsPayable: number;
      shortTermDebt: number;
      accruedExpenses: number;
      other: number;
    };
    longTermLiabilities: {
      longTermDebt: number;
      mortgages: number;
      other: number;
    };
  };
  equity: {
    ownerEquity: number;
    retainedEarnings: number;
    additionalPaidInCapital: number;
  };
}

const BalanceSheet = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<BalanceSheetData>({
    assets: {
      currentAssets: {
        cash: 0,
        accountsReceivable: 0,
        inventory: 0,
        other: 0
      },
      fixedAssets: {
        equipment: 0,
        buildings: 0,
        land: 0,
        other: 0
      }
    },
    liabilities: {
      currentLiabilities: {
        accountsPayable: 0,
        shortTermDebt: 0,
        accruedExpenses: 0,
        other: 0
      },
      longTermLiabilities: {
        longTermDebt: 0,
        mortgages: 0,
        other: 0
      }
    },
    equity: {
      ownerEquity: 0,
      retainedEarnings: 0,
      additionalPaidInCapital: 0
    }
  });

  const handleInputChange = (section: string, subsection: string, field: string, value: number) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof BalanceSheetData],
        [subsection]: {
          ...prev[section as keyof BalanceSheetData][subsection as any],
          [field]: value
        }
      }
    }));
  };

  const handleEquityChange = (field: string, value: number) => {
    setData(prev => ({
      ...prev,
      equity: {
        ...prev.equity,
        [field]: value
      }
    }));
  };

  const calculateTotals = () => {
    const totalCurrentAssets = Object.values(data.assets.currentAssets).reduce((sum, val) => sum + val, 0);
    const totalFixedAssets = Object.values(data.assets.fixedAssets).reduce((sum, val) => sum + val, 0);
    const totalAssets = totalCurrentAssets + totalFixedAssets;

    const totalCurrentLiabilities = Object.values(data.liabilities.currentLiabilities).reduce((sum, val) => sum + val, 0);
    const totalLongTermLiabilities = Object.values(data.liabilities.longTermLiabilities).reduce((sum, val) => sum + val, 0);
    const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

    const totalEquity = Object.values(data.equity).reduce((sum, val) => sum + val, 0);
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    return {
      totalCurrentAssets,
      totalFixedAssets,
      totalAssets,
      totalCurrentLiabilities,
      totalLongTermLiabilities,
      totalLiabilities,
      totalEquity,
      totalLiabilitiesAndEquity,
      isBalanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01
    };
  };

  const totals = calculateTotals();

  const handleSave = () => {
    toast.success("Bilans stanja je uspešno sačuvan");
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
          <h1 className="text-2xl font-bold">Bilans stanja</h1>
          <Button onClick={handleSave}>Sačuvaj bilans</Button>
        </div>

        <div className="mb-6">
          <Label htmlFor="date">Datum bilansa</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-48"
          />
        </div>

        {!totals.isBalanced && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              <strong>Upozorenje:</strong> Bilans nije uravnotežen. 
              Aktiva: {formatCurrency(totals.totalAssets)} | 
              Pasiva: {formatCurrency(totals.totalLiabilitiesAndEquity)}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assets Input */}
          <Card>
            <CardHeader>
              <CardTitle>AKTIVA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Kratkoročna aktiva</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Gotovina</Label>
                    <Input
                      type="number"
                      value={data.assets.currentAssets.cash}
                      onChange={(e) => handleInputChange('assets', 'currentAssets', 'cash', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Potraživanja</Label>
                    <Input
                      type="number"
                      value={data.assets.currentAssets.accountsReceivable}
                      onChange={(e) => handleInputChange('assets', 'currentAssets', 'accountsReceivable', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Zalihe</Label>
                    <Input
                      type="number"
                      value={data.assets.currentAssets.inventory}
                      onChange={(e) => handleInputChange('assets', 'currentAssets', 'inventory', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Ostala kratkoročna aktiva</Label>
                    <Input
                      type="number"
                      value={data.assets.currentAssets.other}
                      onChange={(e) => handleInputChange('assets', 'currentAssets', 'other', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Stalna aktiva</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Oprema</Label>
                    <Input
                      type="number"
                      value={data.assets.fixedAssets.equipment}
                      onChange={(e) => handleInputChange('assets', 'fixedAssets', 'equipment', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Zgrade</Label>
                    <Input
                      type="number"
                      value={data.assets.fixedAssets.buildings}
                      onChange={(e) => handleInputChange('assets', 'fixedAssets', 'buildings', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Zemljište</Label>
                    <Input
                      type="number"
                      value={data.assets.fixedAssets.land}
                      onChange={(e) => handleInputChange('assets', 'fixedAssets', 'land', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Ostala stalna aktiva</Label>
                    <Input
                      type="number"
                      value={data.assets.fixedAssets.other}
                      onChange={(e) => handleInputChange('assets', 'fixedAssets', 'other', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liabilities and Equity Input */}
          <Card>
            <CardHeader>
              <CardTitle>PASIVA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Kratkoročne obaveze</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Obaveze prema dobavljačima</Label>
                    <Input
                      type="number"
                      value={data.liabilities.currentLiabilities.accountsPayable}
                      onChange={(e) => handleInputChange('liabilities', 'currentLiabilities', 'accountsPayable', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Kratkoročni krediti</Label>
                    <Input
                      type="number"
                      value={data.liabilities.currentLiabilities.shortTermDebt}
                      onChange={(e) => handleInputChange('liabilities', 'currentLiabilities', 'shortTermDebt', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Rezervisanja</Label>
                    <Input
                      type="number"
                      value={data.liabilities.currentLiabilities.accruedExpenses}
                      onChange={(e) => handleInputChange('liabilities', 'currentLiabilities', 'accruedExpenses', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Ostale kratkoročne obaveze</Label>
                    <Input
                      type="number"
                      value={data.liabilities.currentLiabilities.other}
                      onChange={(e) => handleInputChange('liabilities', 'currentLiabilities', 'other', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Dugoročne obaveze</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Dugoročni krediti</Label>
                    <Input
                      type="number"
                      value={data.liabilities.longTermLiabilities.longTermDebt}
                      onChange={(e) => handleInputChange('liabilities', 'longTermLiabilities', 'longTermDebt', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Hipoteke</Label>
                    <Input
                      type="number"
                      value={data.liabilities.longTermLiabilities.mortgages}
                      onChange={(e) => handleInputChange('liabilities', 'longTermLiabilities', 'mortgages', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Ostale dugoročne obaveze</Label>
                    <Input
                      type="number"
                      value={data.liabilities.longTermLiabilities.other}
                      onChange={(e) => handleInputChange('liabilities', 'longTermLiabilities', 'other', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Kapital</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Osnovni kapital</Label>
                    <Input
                      type="number"
                      value={data.equity.ownerEquity}
                      onChange={(e) => handleEquityChange('ownerEquity', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Zadržana dobit</Label>
                    <Input
                      type="number"
                      value={data.equity.retainedEarnings}
                      onChange={(e) => handleEquityChange('retainedEarnings', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Dodatno uplaćeni kapital</Label>
                    <Input
                      type="number"
                      value={data.equity.additionalPaidInCapital}
                      onChange={(e) => handleEquityChange('additionalPaidInCapital', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Balance Sheet Display */}
        <Card>
          <CardHeader>
            <CardTitle>Bilans stanja na dan {new Date(date).toLocaleDateString('sr-RS')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Assets */}
              <div>
                <h3 className="font-bold text-lg mb-4">AKTIVA</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Kratkoročna aktiva</h4>
                    <div className="ml-4 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Gotovina</span>
                        <span>{formatCurrency(data.assets.currentAssets.cash)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Potraživanja</span>
                        <span>{formatCurrency(data.assets.currentAssets.accountsReceivable)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zalihe</span>
                        <span>{formatCurrency(data.assets.currentAssets.inventory)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ostalo</span>
                        <span>{formatCurrency(data.assets.currentAssets.other)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Ukupno kratkoročna aktiva</span>
                        <span>{formatCurrency(totals.totalCurrentAssets)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Stalna aktiva</h4>
                    <div className="ml-4 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Oprema</span>
                        <span>{formatCurrency(data.assets.fixedAssets.equipment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zgrade</span>
                        <span>{formatCurrency(data.assets.fixedAssets.buildings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zemljište</span>
                        <span>{formatCurrency(data.assets.fixedAssets.land)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ostalo</span>
                        <span>{formatCurrency(data.assets.fixedAssets.other)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Ukupno stalna aktiva</span>
                        <span>{formatCurrency(totals.totalFixedAssets)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>UKUPNA AKTIVA</span>
                      <span>{formatCurrency(totals.totalAssets)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liabilities and Equity */}
              <div>
                <h3 className="font-bold text-lg mb-4">PASIVA</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Kratkoročne obaveze</h4>
                    <div className="ml-4 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Obaveze prema dobavljačima</span>
                        <span>{formatCurrency(data.liabilities.currentLiabilities.accountsPayable)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kratkoročni krediti</span>
                        <span>{formatCurrency(data.liabilities.currentLiabilities.shortTermDebt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rezervisanja</span>
                        <span>{formatCurrency(data.liabilities.currentLiabilities.accruedExpenses)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ostalo</span>
                        <span>{formatCurrency(data.liabilities.currentLiabilities.other)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Ukupno kratkoročne obaveze</span>
                        <span>{formatCurrency(totals.totalCurrentLiabilities)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Dugoročne obaveze</h4>
                    <div className="ml-4 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Dugoročni krediti</span>
                        <span>{formatCurrency(data.liabilities.longTermLiabilities.longTermDebt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hipoteke</span>
                        <span>{formatCurrency(data.liabilities.longTermLiabilities.mortgages)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ostalo</span>
                        <span>{formatCurrency(data.liabilities.longTermLiabilities.other)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Ukupno dugoročne obaveze</span>
                        <span>{formatCurrency(totals.totalLongTermLiabilities)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Kapital</h4>
                    <div className="ml-4 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Osnovni kapital</span>
                        <span>{formatCurrency(data.equity.ownerEquity)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zadržana dobit</span>
                        <span>{formatCurrency(data.equity.retainedEarnings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dodatno uplaćeni kapital</span>
                        <span>{formatCurrency(data.equity.additionalPaidInCapital)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Ukupan kapital</span>
                        <span>{formatCurrency(totals.totalEquity)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>UKUPNA PASIVA</span>
                      <span className={totals.isBalanced ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(totals.totalLiabilitiesAndEquity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BalanceSheet;

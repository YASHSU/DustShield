import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Slider } from '../components/ui/Slider';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { calculateRetrofitROI } from '../utils/calculations';
import { RetrofitInputs, RetrofitOutputs } from '../types';
import { DEFAULT_SIMULATOR_INPUTS } from '../constants';
import { TrendChart } from '../components/charts/DashboardCharts';
import { DollarSign, BarChart2, TrendingUp, Compass, Calendar, Calculator, RefreshCcw } from 'lucide-react';

const DEFAULT_RETROFIT_INPUTS: RetrofitInputs = {
  fleetSize: 30,
  retrofitCostPerTruck: 35000, // INR per truck for full covers, diffusers, curtains
  annualMaintenancePerTruck: 6000, // INR per truck maintenance
  tripsPerDayPerTruck: 3 // average daily roundtrips
};

export const CostCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<RetrofitInputs>(DEFAULT_RETROFIT_INPUTS);
  const [outputs, setOutputs] = useState<RetrofitOutputs>(() =>
    calculateRetrofitROI(DEFAULT_RETROFIT_INPUTS, DEFAULT_SIMULATOR_INPUTS)
  );

  useEffect(() => {
    const results = calculateRetrofitROI(inputs, DEFAULT_SIMULATOR_INPUTS);
    setOutputs(results);
  }, [inputs]);

  const resetInputs = () => {
    setInputs(DEFAULT_RETROFIT_INPUTS);
  };

  const handleSliderChange = (key: keyof RetrofitInputs, val: number) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  // Generate cash flow coordinates over 36 months
  const generateCashFlowData = () => {
    const data = [];
    const monthlyNetSavings = (outputs.annualSavingsINR - outputs.annualMaintenanceTotal) / 12;
    const initialInvestment = -outputs.totalInvestment;

    for (let month = 0; month <= 24; month += 2) {
      const cumulativeFlow = Math.round(initialInvestment + monthlyNetSavings * month);
      data.push({
        month: `Month ${month}`,
        'Net Cash Flow': cumulativeFlow,
        'Break-Even Base': 0
      });
    }
    return data;
  };

  const cashFlowData = generateCashFlowData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-panel border-white/5">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground leading-none m-0">Economic Benefit & ROI Calculator</h2>
            <p className="text-xs text-muted-foreground">Estimate initial capital investment, material salvage margins, and amortization cycles for fleet retrofits.</p>
          </div>
          <Button variant="outline" size="sm" onClick={resetInputs} className="gap-1.5 text-xs">
            <RefreshCcw className="h-4 w-4" /> Reset Budget
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Inputs Slider Form (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle>Fleet Capital Parameters</CardTitle>
              <CardDescription>Configure fleet sizes, retrofit components, and transit routes schedules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Slider
                label="Active Fleet Size"
                min={5}
                max={200}
                step={5}
                value={inputs.fleetSize}
                suffix=" trucks"
                onChange={(val) => handleSliderChange('fleetSize', val)}
              />

              <Slider
                label="Retrofit Cost (per unit)"
                min={10000}
                max={100000}
                step={5000}
                value={inputs.retrofitCostPerTruck}
                suffix=" INR"
                onChange={(val) => handleSliderChange('retrofitCostPerTruck', val)}
              />

              <Slider
                label="Annual Maintenance Cost (per unit)"
                min={2000}
                max={20000}
                step={1000}
                value={inputs.annualMaintenancePerTruck}
                suffix=" INR"
                onChange={(val) => handleSliderChange('annualMaintenancePerTruck', val)}
              />

              <Slider
                label="Daily Roundtrips (per unit)"
                min={1}
                max={8}
                step={1}
                value={inputs.tripsPerDayPerTruck}
                suffix=" trips"
                onChange={(val) => handleSliderChange('tripsPerDayPerTruck', val)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right: Calculations Outputs (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main ROI Outputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Total Investment */}
            <Card className="glass-panel border-white/5">
              <CardContent className="p-5 flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">CapEx Investment</span>
                  <h3 className="text-2xl font-extrabold font-mono text-foreground leading-none m-0">
                    ₹{outputs.totalInvestment.toLocaleString()}
                  </h3>
                  <span className="text-[10px] text-muted-foreground">Fleet retrofitting cost</span>
                </div>
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <Calculator className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            {/* Annual Net Savings */}
            <Card className="glass-panel border-white/5">
              <CardContent className="p-5 flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Net Annual Savings</span>
                  <h3 className="text-2xl font-extrabold font-mono text-secondary leading-none m-0">
                    ₹{outputs.annualSavingsINR.toLocaleString()}
                  </h3>
                  <span className="text-[10px] text-secondary font-bold uppercase">Product loss + fines avoided</span>
                </div>
                <div className="h-10 w-10 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                  <DollarSign className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            {/* Payback Period */}
            <Card className="glass-panel border-white/5">
              <CardContent className="p-5 flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Amortization Period</span>
                  <h3 className="text-2xl font-extrabold font-mono text-foreground leading-none m-0">
                    {outputs.paybackPeriodMonths} <span className="text-xs font-sans text-muted-foreground">Months</span>
                  </h3>
                  <Badge variant={outputs.paybackPeriodMonths <= 12 ? 'success' : 'warning'} className="mt-1">
                    {outputs.paybackPeriodMonths <= 12 ? 'Rapid Payback' : 'Gradual ROI'}
                  </Badge>
                </div>
                <div className="h-10 w-10 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400">
                  <Calendar className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            {/* Return on Investment */}
            <Card className="glass-panel border-white/5">
              <CardContent className="p-5 flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">5-Yr Return (ROI)</span>
                  <h3 className="text-2xl font-extrabold font-mono text-foreground leading-none m-0">
                    {outputs.roiPercent}%
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">Net 5-year yield ratio</span>
                </div>
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Environmental saved metrics card */}
          <Card className="glass-panel border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs">Saved Volume Estimates</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#0E1528] rounded-lg border border-white/5 text-center">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Annual Dust Saved</span>
                <p className="text-base font-extrabold font-mono text-foreground mt-1">{outputs.annualDustSavedKg.toLocaleString()} kg</p>
              </div>
              <div className="p-3 bg-[#0E1528] rounded-lg border border-white/5 text-center">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Annual Material Salvaged</span>
                <p className="text-base font-extrabold font-mono text-secondary mt-1">{(outputs.annualMaterialSavedKg / 1000).toFixed(1)} Tons</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Break-even cash flow visualization chart */}
      <Card className="glass-panel border-white/5">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Cumulative Cash Flow Projection</CardTitle>
              <CardDescription>Break-even tracking mapping initial capital outlays against cumulative materials recovery earnings over 24 months.</CardDescription>
            </div>
            <div className="p-2 bg-secondary/10 border border-secondary/20 rounded-lg text-xs text-secondary font-bold font-mono">
              Amortization Month: {outputs.paybackPeriodMonths}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <TrendChart
            data={cashFlowData}
            xKey="month"
            dataKeys={['Net Cash Flow', 'Break-Even Base']}
            colors={['#00E5FF', 'rgba(239, 68, 68, 0.4)']}
            units={[' INR', '']}
            type="line"
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default CostCalculator;

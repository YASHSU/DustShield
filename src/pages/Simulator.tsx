import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Slider } from '../components/ui/Slider';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { calculateDustLeakage } from '../utils/calculations';
import { SimulatorInputs, SimulatorOutputs } from '../types';
import { DEFAULT_SIMULATOR_INPUTS } from '../constants';
import {
  TrendingDown,
  Info,
  CheckCircle,
  Truck,
  Leaf,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Simulator: React.FC = () => {
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_SIMULATOR_INPUTS);
  const [outputs, setOutputs] = useState<SimulatorOutputs>(() => calculateDustLeakage(DEFAULT_SIMULATOR_INPUTS));

  // Update simulator calculations instantly on any input changes
  useEffect(() => {
    const results = calculateDustLeakage(inputs);
    setOutputs(results);
  }, [inputs]);

  const resetSimulator = () => {
    setInputs(DEFAULT_SIMULATOR_INPUTS);
  };

  const handleSelectChange = (key: keyof SimulatorInputs, val: string) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  const handleSliderChange = (key: keyof SimulatorInputs, val: number) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  const handleToggleChange = (key: keyof SimulatorInputs) => {
    setInputs((prev) => ({ ...prev, [key]: !prev[key as keyof SimulatorInputs] }));
  };

  const truckOptions = [
    { value: 'Dumper (Open)', label: 'Dumper (Open)' },
    { value: 'Dumper (Tarp Covered)', label: 'Dumper (Tarp Covered)' },
    { value: 'Semi-Trailer', label: 'Semi-Trailer' },
    { value: 'Cement Mixer', label: 'Cement Mixer' },
    { value: 'Bulk Carrier', label: 'Bulk Carrier' }
  ];

  const cargoOptions = [
    { value: 'Coal', label: 'Coal (Fuel)' },
    { value: 'Fly Ash', label: 'Fly Ash (Fine Slag)' },
    { value: 'Iron Ore', label: 'Iron Ore (Metallic)' },
    { value: 'Cement', label: 'Cement (Dry Powder)' },
    { value: 'Sand', label: 'Sand (Silica)' },
    { value: 'Aggregates', label: 'Aggregates (Gravel)' }
  ];

  return (
    <div className="space-y-6">
      {/* Description Header */}
      <Card className="glass-panel border-white/5">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground leading-none m-0">Cargo Dust Leakage Simulator</h2>
            <p className="text-xs text-muted-foreground">Adjust transport variables to estimate airborne leakage factors based on EPA AP-42 standard frameworks.</p>
          </div>
          <Button variant="outline" size="sm" onClick={resetSimulator} className="gap-1.5 text-xs">
            <RotateCcw className="h-4 w-4" /> Reset Inputs
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Inputs (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle>Haulage Configuration Parameters</CardTitle>
              <CardDescription>Configure fleet details, cargo weight, speeds, and weather conditions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Truck Category"
                  options={truckOptions}
                  value={inputs.truckType}
                  onChange={(e) => handleSelectChange('truckType', e.target.value)}
                />
                <Select
                  label="Cargo Type"
                  options={cargoOptions}
                  value={inputs.cargoType}
                  onChange={(e) => handleSelectChange('cargoType', e.target.value)}
                />
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <Slider
                  label="Fleet Payload (per unit)"
                  min={10}
                  max={45}
                  step={1}
                  value={inputs.payload}
                  suffix=" tons"
                  onChange={(val) => handleSliderChange('payload', val)}
                />
                <Slider
                  label="Daily Truck Deployments"
                  min={10}
                  max={500}
                  step={5}
                  value={inputs.truckCount}
                  suffix=" trucks"
                  onChange={(val) => handleSliderChange('truckCount', val)}
                />
                <Slider
                  label="Average Speed"
                  min={20}
                  max={80}
                  step={5}
                  value={inputs.avgSpeed}
                  suffix=" km/h"
                  onChange={(val) => handleSliderChange('avgSpeed', val)}
                />
                <Slider
                  label="Corridor Wind Speed"
                  min={0}
                  max={40}
                  step={1}
                  value={inputs.windSpeed}
                  suffix=" km/h"
                  onChange={(val) => handleSliderChange('windSpeed', val)}
                />
                <Slider
                  label="Relative Humidity"
                  min={10}
                  max={90}
                  step={5}
                  value={inputs.humidity}
                  suffix=" %"
                  onChange={(val) => handleSliderChange('humidity', val)}
                />
                <Slider
                  label="Road Surface Dryness"
                  min={10}
                  max={100}
                  step={5}
                  value={inputs.roadDryness}
                  suffix=" %"
                  onChange={(val) => handleSliderChange('roadDryness', val)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Retrofit Toggles */}
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle>Smart Capture Retrofits</CardTitle>
              <CardDescription>Enable active and passive mechanical devices to restrict particulate leakage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Truck Cover */}
                <button
                  onClick={() => handleToggleChange('hasCover')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-24 transition-all duration-200 cursor-pointer ${
                    inputs.hasCover
                      ? 'border-primary/40 bg-primary/10 text-primary shadow-lg shadow-primary/5'
                      : 'border-white/5 bg-card/20 text-muted-foreground hover:bg-card/45 hover:text-foreground'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider">Tarp Cover</span>
                  <span className="font-extrabold text-xs">Sliding Tarpaulin</span>
                </button>

                {/* Rear Dust Curtain */}
                <button
                  onClick={() => handleToggleChange('rearDustCurtain')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-24 transition-all duration-200 cursor-pointer ${
                    inputs.rearDustCurtain
                      ? 'border-primary/40 bg-primary/10 text-primary shadow-lg shadow-primary/5'
                      : 'border-white/5 bg-card/20 text-muted-foreground hover:bg-card/45 hover:text-foreground'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider">Rear Dust Curtain</span>
                  <span className="font-extrabold text-xs">Vacuum Shield</span>
                </button>

                {/* Aerodynamic Diffuser */}
                <button
                  onClick={() => handleToggleChange('aerodynamicDiffuser')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-24 transition-all duration-200 cursor-pointer ${
                    inputs.aerodynamicDiffuser
                      ? 'border-primary/40 bg-primary/10 text-primary shadow-lg shadow-primary/5'
                      : 'border-white/5 bg-card/20 text-muted-foreground hover:bg-card/45 hover:text-foreground'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider">Aerodynamic Diffuser</span>
                  <span className="font-extrabold text-xs">Airflow Deflector</span>
                </button>

                {/* Tailgate Seal */}
                <button
                  onClick={() => handleToggleChange('tailgateSeal')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-24 transition-all duration-200 cursor-pointer ${
                    inputs.tailgateSeal
                      ? 'border-primary/40 bg-primary/10 text-primary shadow-lg shadow-primary/5'
                      : 'border-white/5 bg-card/20 text-muted-foreground hover:bg-card/45 hover:text-foreground'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider">Tailgate Seal</span>
                  <span className="font-extrabold text-xs">Rubber Gasket</span>
                </button>

                {/* Active Dust Filter */}
                <button
                  onClick={() => handleToggleChange('filterInstalled')}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-24 transition-all duration-200 cursor-pointer ${
                    inputs.filterInstalled
                      ? 'border-primary/40 bg-primary/10 text-primary shadow-lg shadow-primary/5'
                      : 'border-white/5 bg-card/20 text-muted-foreground hover:bg-card/45 hover:text-foreground'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider">Active Capture Filter</span>
                  <span className="font-extrabold text-xs">Internal Exhaust Fan</span>
                </button>
              </div>

              {inputs.filterInstalled && (
                <div className="p-4 rounded-xl border border-white/5 bg-card/40 mt-4 animate-fade-in">
                  <Slider
                    label="Active Filter Efficiency"
                    min={50}
                    max={98}
                    step={1}
                    value={inputs.filterEfficiency}
                    suffix=" %"
                    onChange={(val) => handleSliderChange('filterEfficiency', val)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Output Calculations (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Before vs After comparison */}
          <Card className="glass-panel border-white/5 relative overflow-hidden">
            <CardHeader>
              <CardTitle>Emissions Impact Report</CardTitle>
              <CardDescription>Comparative analysis showing leakage before and after engineering controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Before Card */}
              <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest leading-none">Unmitigated Leakage</span>
                  <h4 className="text-2xl font-extrabold font-mono text-red-500 mt-1 leading-none">
                    {outputs.beforeLeakage} <span className="text-xs font-sans text-muted-foreground">kg/trip</span>
                  </h4>
                </div>
                <div className="h-10 w-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className="flex justify-center -my-2.5">
                <div className="h-6 w-6 rounded-full bg-[#0E1528] border border-white/5 flex items-center justify-center text-primary text-xs">
                  ↓
                </div>
              </div>

              {/* After Card */}
              <div className="p-4 rounded-xl border border-secondary/20 bg-secondary/10 flex items-center justify-between shadow-lg shadow-secondary/5">
                <div>
                  <span className="text-[9px] font-bold text-secondary uppercase tracking-widest leading-none">Mitigated Leakage</span>
                  <h4 className="text-2xl font-extrabold font-mono text-secondary mt-1 leading-none">
                    {outputs.afterLeakage} <span className="text-xs font-sans text-muted-foreground">kg/trip</span>
                  </h4>
                </div>
                <div className="h-10 w-10 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reduction Circle */}
          <Card className="glass-panel border-white/5">
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
              <div className="relative h-32 w-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="54" className="stroke-muted" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#10B981"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - outputs.dustReductionPercent / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold font-mono text-foreground flex items-center">
                    {outputs.dustReductionPercent}<span className="text-sm font-sans text-muted-foreground">%</span>
                  </span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Reduced</span>
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-foreground flex items-center justify-center gap-1">
                  <TrendingDown className="h-4 w-4 text-secondary" /> Dust Emissions Cut By {outputs.dustReductionPercent}%
                </p>
                <p className="text-[10px] text-muted-foreground">Corridor ambient PM10 contribution decreases by {outputs.pm10Contribution} ug/m3.</p>
              </div>
            </CardContent>
          </Card>

          {/* Financial & Environmental benefits */}
          <Card className="glass-panel border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Mitigation Value Index</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Environmental Score */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Leaf className="h-4 w-4 text-emerald-400" /> Environmental Index:
                </span>
                <span className="font-extrabold text-sm text-foreground font-mono">
                  {outputs.environmentalScore} <span className="text-[10px] text-muted-foreground font-sans">/ 100</span>
                </span>
              </div>

              {/* Material Saved */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-cyan-400" /> Cargo Dust Saved:
                </span>
                <span className="font-bold text-foreground font-mono">
                  {Math.round((outputs.beforeLeakage - outputs.afterLeakage) * inputs.truckCount).toLocaleString()} kg/day
                </span>
              </div>

              {/* Financial Savings */}
              <div className="flex justify-between items-center text-xs pt-3 border-t border-white/5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-yellow-500" /> Daily Material Savings:
                </span>
                <span className="font-extrabold text-foreground font-mono">
                  ₹{outputs.dailySavingsINR.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-yellow-500" /> Annualized Savings:
                </span>
                <span className="font-extrabold text-secondary font-mono">
                  ₹{outputs.annualSavingsINR.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Simulator;

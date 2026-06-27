import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { TrendChart } from '../components/charts/DashboardCharts';
import { ShieldCheck, Zap, AlertTriangle, TrendingDown, Leaf, DollarSign } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const Solutions: React.FC = () => {
  // Comparative charts data
  const parameterComparison = [
    { name: 'Dust Leakage', 'Current Dumper': 28.5, 'Smart Capture': 4.2, unit: ' kg/trip' },
    { name: 'Material Loss Value', 'Current Dumper': 5700, 'Smart Capture': 840, unit: ' INR/day' },
    { name: 'Air Pollution Index', 'Current Dumper': 84, 'Smart Capture': 12, unit: ' PM10 Impact' }
  ];

  const lifecycleData = [
    { year: 'Yr 1', 'Current System Cost': 45000, 'Smart System Cost': 25000 },
    { year: 'Yr 2', 'Current System Cost': 60000, 'Smart System Cost': 30000 },
    { year: 'Yr 3', 'Current System Cost': 75000, 'Smart System Cost': 35000 },
    { year: 'Yr 4', 'Current System Cost': 90000, 'Smart System Cost': 40000 },
    { year: 'Yr 5', 'Current System Cost': 105000, 'Smart System Cost': 45000 }
  ];

  return (
    <div className="space-y-6">
      {/* Description Header */}
      <Card className="glass-panel border-white/5">
        <CardContent className="p-4 space-y-1">
          <h2 className="text-lg font-bold text-foreground leading-none m-0">Engineering Mitigations Dashboard</h2>
          <p className="text-xs text-muted-foreground">Evaluating traditional open haulage methods against the integrated Smart Dust Capture configuration.</p>
        </CardContent>
      </Card>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Baseline System */}
        <Card className="glass-panel border-red-500/10 bg-red-950/5 flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-red-500/10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-red-400">Baseline Haulage Setup</CardTitle>
              <Badge variant="destructive">Standard Setup</Badge>
            </div>
            <CardDescription className="text-red-400/70">Unshielded open beds subject to heavy aerodynamic wind shearing.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4 flex-1">
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                <span><strong>High Particulate Drift:</strong> Fine particles (coal, fly ash) become airborne, causing direct corridor AQI spikes.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                <span><strong>Heavy Cargo Shrinkage:</strong> Loose materials escape the bed, leading to average loss rates of 1.2% per load.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                <span><strong>Regulatory Fine Penalties:</strong> High compliance risks, leading to frequent CPCB fine notifications.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart System */}
        <Card className="glass-panel border-secondary/20 bg-secondary/5 flex flex-col justify-between shadow-xl shadow-secondary/5">
          <CardHeader className="pb-3 border-b border-secondary/10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-secondary">Smart Dust Capture Configuration</CardTitle>
              <Badge variant="success">Fully Shielded</Badge>
            </div>
            <CardDescription className="text-secondary/70">Shielded beds with aerodynamic diffusers, sealing gaskets, and vacuum suction.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4 flex-1">
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4.5 w-4.5 text-secondary shrink-0" />
                <span><strong>90%+ Emission Suppression:</strong> Restricts particulate escaping the bed at speeds up to 80 km/h.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4.5 w-4.5 text-secondary shrink-0" />
                <span><strong>Product Salvage Recovery:</strong> Captures coal and cement dust, saving up to ₹7.8L annualized per truck.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4.5 w-4.5 text-secondary shrink-0" />
                <span><strong>Exhaust Vacuum Filtration:</strong> Active fans route bed air through baghouse filter layers.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparative Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameter Metrics */}
        <Card className="lg:col-span-2 glass-panel border-white/5">
          <CardHeader>
            <CardTitle>Mitigation System Parameter Comparison</CardTitle>
            <CardDescription>Direct metrics contrasting leakage volumes, materials value loss, and ambient PM10 drift.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <TrendChart
              data={parameterComparison}
              xKey="name"
              dataKeys={['Current Dumper', 'Smart Capture']}
              colors={['#EF4444', '#10B981']}
              units={['', '']}
              type="bar"
            />
          </CardContent>
        </Card>

        {/* Environmental impact index */}
        <Card className="glass-panel border-white/5 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Environmental Benefits</CardTitle>
            <CardDescription>Annualized benefits expected after retrofitting a fleet of 50 dumpers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* PM10 Reduction */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5"><TrendingDown className="h-4 w-4 text-secondary" /> Corridor PM10 Decrement:</span>
              <span className="font-extrabold text-secondary font-mono">18.5 ug/m3</span>
            </div>

            {/* CO2 Lifecycle */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5"><Leaf className="h-4 w-4 text-emerald-400" /> CO₂ Footprint Saved:</span>
              <span className="font-extrabold text-foreground font-mono">310 Tons/yr</span>
            </div>

            {/* Material Retained */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5"><Zap className="h-4 w-4 text-cyan-400" /> Recovered Product Cargo:</span>
              <span className="font-bold text-foreground font-mono">140 Tons/yr</span>
            </div>

            {/* Payback period */}
            <div className="flex justify-between items-center text-xs pt-3 border-t border-white/5">
              <span className="text-muted-foreground flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-yellow-500" /> Average Retrofit Payback:</span>
              <span className="font-extrabold text-primary font-mono">8.4 Months</span>
            </div>
          </CardContent>
          <CardContent className="pt-2 pb-6">
            <div className="p-3 rounded-lg border border-white/5 bg-[#0E1528] text-[9px] text-muted-foreground leading-relaxed text-center font-bold">
              Smart Dust Capture system lifecycle: <span className="text-foreground font-mono">6 - 8 Years</span> (Low wear and tear)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lifecycle Cost analysis */}
      <Card className="glass-panel border-white/5">
        <CardHeader>
          <CardTitle>5-Year Maintenance Costs Projection</CardTitle>
          <CardDescription>Comparing escalating maintenance, product loss, and fine expenses of standard open dumpers vs initial retrofits.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <TrendChart
            data={lifecycleData}
            xKey="year"
            dataKeys={['Current System Cost', 'Smart System Cost']}
            colors={['#EF4444', '#10B981']}
            units={[' INR', ' INR']}
            type="line"
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default Solutions;

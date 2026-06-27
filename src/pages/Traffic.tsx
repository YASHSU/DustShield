import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { fetchLiveTraffic } from '../api/environmentalService';
import { TrafficReading } from '../types';
import { TRUCK_ROUTES } from '../constants';
import { TrendChart } from '../components/charts/DashboardCharts';
import { Car, Clock, Navigation, AlertOctagon, TrendingDown, RefreshCw, Layers, AlertTriangle } from 'lucide-react';

export const Traffic: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [traffic, setTraffic] = useState<TrafficReading | null>(null);

  const loadTraffic = async () => {
    setLoading(true);
    try {
      const data = await fetchLiveTraffic();
      setTraffic(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTraffic();
  }, []);

  if (loading || !traffic) {
    return (
      <div className="shimmer h-[600px] border border-white/5 bg-[#0C1226]/50 rounded-xl" />
    );
  }

  // Mock hourly congestion predictions for Recharts (coal vs aggregate transport loads)
  const peakPredictions = [
    { hour: '06:00', Congestion: 25, 'Heavy Vehicles': 110 },
    { hour: '08:00', Congestion: 65, 'Heavy Vehicles': 340 }, // Peak
    { hour: '10:00', Congestion: 78, 'Heavy Vehicles': 450 }, // Peak
    { hour: '12:00', Congestion: 45, 'Heavy Vehicles': 220 },
    { hour: '14:00', Congestion: 52, 'Heavy Vehicles': 280 },
    { hour: '16:00', Congestion: 60, 'Heavy Vehicles': 310 },
    { hour: '18:00', Congestion: 85, 'Heavy Vehicles': 480 }, // Evening Peak
    { hour: '20:00', Congestion: 72, 'Heavy Vehicles': 410 },
    { hour: '22:00', Congestion: 38, 'Heavy Vehicles': 290 },
    { hour: '02:00', Congestion: 20, 'Heavy Vehicles': 320 }  // Night hauling bypass peaks
  ];

  return (
    <div className="space-y-6">
      {/* Synchronization Header */}
      <Card className="glass-panel border-white/5">
        <CardContent className="p-4 flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground leading-none m-0">Haulage Traffic Telemetry</h2>
            <p className="text-xs text-muted-foreground">Monitoring heavy transport density and speeds across Raipur-Bhilai transit corridors.</p>
          </div>
          <button
            onClick={loadTraffic}
            className="p-2.5 rounded-lg bg-card border border-white/5 hover:bg-white/5 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </CardContent>
      </Card>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Congestion Meter */}
        <Card className="glass-panel border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Congestion Index</span>
              <h3 className="text-3xl font-extrabold font-mono text-foreground leading-none m-0">
                {traffic.congestionLevel}%
              </h3>
              <Badge variant={traffic.congestionLevel > 65 ? 'destructive' : 'success'}>
                {traffic.status} Flow
              </Badge>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Layers className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Speed Card */}
        <Card className="glass-panel border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Avg Vehicle Speed</span>
              <h3 className="text-3xl font-extrabold font-mono text-foreground leading-none m-0">
                {traffic.averageSpeed} <span className="text-xs font-semibold text-muted-foreground">km/h</span>
              </h3>
              <span className="text-[10px] text-muted-foreground">Slowing down increases local emissions</span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Heavy Vehicle Density */}
        <Card className="glass-panel border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Heavy Hauler Density</span>
              <h3 className="text-3xl font-extrabold font-mono text-foreground leading-none m-0">
                {traffic.heavyVehicleDensity} <span className="text-xs font-semibold text-muted-foreground">units/km</span>
              </h3>
              <span className="text-[10px] text-red-400 font-bold uppercase">Estimated coal/sand haulers</span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <Car className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Corridor Segment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Details Panel */}
        <Card className="lg:col-span-2 glass-panel border-white/5">
          <CardHeader>
            <CardTitle>Corridor Segments Breakdown</CardTitle>
            <CardDescription>Sensor tracking across critical loading bypasses and junctions.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-muted-foreground font-bold">
                    <th className="p-4 uppercase tracking-wider">Corridor Path</th>
                    <th className="p-4 uppercase tracking-wider text-center">Daily Trucks</th>
                    <th className="p-4 uppercase tracking-wider text-center">Avg Speed</th>
                    <th className="p-4 uppercase tracking-wider text-center">Congestion</th>
                    <th className="p-4 uppercase tracking-wider text-right">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {TRUCK_ROUTES.map((route) => (
                    <tr key={route.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-2.5">
                        <Navigation className="h-4 w-4 text-primary" />
                        <span>{route.name}</span>
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-foreground">{route.heavyTruckCount}</td>
                      <td className="p-4 text-center font-mono font-semibold">{route.averageSpeed} km/h</td>
                      <td className="p-4 text-center font-mono">
                        <span className={`px-2 py-0.5 rounded ${
                          route.congestion > 60 ? 'bg-red-500/10 text-red-500' : 'bg-secondary/10 text-secondary'
                        }`}>{route.congestion}%</span>
                      </td>
                      <td className="p-4 text-right font-mono font-extrabold">
                        <span style={{ color: route.dustRiskScore > 75 ? '#EF4444' : '#00E5FF' }}>
                          {route.dustRiskScore}/100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Warning Indicator */}
        <Card className="glass-panel border-white/5 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Bypass Advisories</CardTitle>
            <CardDescription>Live traffic directives for heavy transportation units.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-500 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold m-0 leading-none">NH-53 Tatibandh Congestion</p>
                <p className="m-0 mt-1.5 leading-relaxed text-muted-foreground">
                  Severe congestion detected at Tatibandh Crossing. Average speeds dropped below 15 km/h. High idle times are increasing local PM10 concentration.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-xs text-yellow-500 flex items-start gap-3">
              <Clock className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold m-0 leading-none">Bhilai Steel Plant Entry Restriction</p>
                <p className="m-0 mt-1.5 leading-relaxed text-muted-foreground">
                  Heavy truck queuing restricted on BSP Link Road. Operations advised to route units through the Eastern bypass until 21:00.
                </p>
              </div>
            </div>
          </CardContent>
          <CardContent className="pt-0 pb-6">
            <div className="p-3 rounded-lg bg-[#0E1528] border border-white/5 text-[10px] text-muted-foreground flex justify-between items-center font-bold">
              <span>Next Peak Hour Cycle:</span>
              <span className="text-yellow-500 font-mono">17:00 - 20:30 (High Density)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictor Chart */}
      <Card className="glass-panel border-white/5">
        <CardHeader>
          <CardTitle>Temporal Peak Predictor</CardTitle>
          <CardDescription>Expected congestion indexes and heavy vehicle load distributions over a 24-hour cycle.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <TrendChart
            data={peakPredictions}
            xKey="hour"
            dataKeys={['Congestion', 'Heavy Vehicles']}
            colors={['#EF4444', '#00E5FF']}
            units={['%', ' units']}
            type="area"
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default Traffic;

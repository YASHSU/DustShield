import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Wind,
  Navigation,
  TrendingDown,
  Truck,
  TrendingUp,
  Droplets,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Eye,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AQIGauge, TrendChart } from '../components/charts/DashboardCharts';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { fetchLiveWeather, fetchLiveAQI, fetchLiveTraffic } from '../api/environmentalService';
import { AQIReading, WeatherData, TrafficReading, AlertItem } from '../types';
import { calculateDustLeakage } from '../utils/calculations';
import { DEFAULT_SIMULATOR_INPUTS } from '../constants';

interface DashboardProps {
  alerts: AlertItem[];
}

export const Dashboard: React.FC<DashboardProps> = ({ alerts }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [aqiList, setAqiList] = useState<AQIReading[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [traffic, setTraffic] = useState<TrafficReading | null>(null);

  // Load live environmental feeds
  useEffect(() => {
    async function loadData() {
      try {
        const [weatherRes, aqiRes, trafficRes] = await Promise.all([
          fetchLiveWeather(),
          fetchLiveAQI(),
          fetchLiveTraffic()
        ]);
        setWeather(weatherRes.current);
        setAqiList(aqiRes);
        setTraffic(trafficRes);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute live leakage estimate based on weather inputs
  const simulatedOutputs = weather
    ? calculateDustLeakage({
        ...DEFAULT_SIMULATOR_INPUTS,
        windSpeed: Math.round(weather.windSpeed),
        humidity: weather.humidity
      })
    : calculateDustLeakage(DEFAULT_SIMULATOR_INPUTS);

  // Calculate dynamic Dust Risk index (0-100)
  // Determined by wind speed, dryness, traffic congestion, and unmitigated haulage
  const computeRiskIndex = () => {
    if (!weather || !traffic) return 55;
    const windComponent = Math.min(30, weather.windSpeed) * 1.2; // max 36
    const humidityComponent = Math.max(0, 100 - weather.humidity) * 0.35; // max 35
    const trafficComponent = (traffic.congestionLevel) * 0.3; // max 30
    return Math.round(Math.min(100, Math.max(10, windComponent + humidityComponent + trafficComponent)));
  };

  const riskIndex = computeRiskIndex();

  const getRiskStatus = (risk: number) => {
    if (risk < 35) return { label: 'Low Risk', color: 'text-secondary bg-secondary/10 border-secondary/20', desc: 'Favorable hauling conditions.' };
    if (risk < 70) return { label: 'Moderate Risk', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', desc: 'Sprinklers active, covers required.' };
    return { label: 'High Alert', color: 'text-red-500 bg-red-500/10 border-red-500/20 animate-pulse', desc: 'Delay fly ash operations. Check seals.' };
  };

  const riskStatus = getRiskStatus(riskIndex);

  // Mock Trend Chart Data (PM10 Corridor Readings over past 8 hours)
  const hourlyTrendData = [
    { hour: '08:00', 'Siltara Hub': 210, 'Urla Bypass': 180, 'Bhilai Sector-1': 130 },
    { hour: '10:00', 'Siltara Hub': 245, 'Urla Bypass': 210, 'Bhilai Sector-1': 148 },
    { hour: '12:00', 'Siltara Hub': 280, 'Urla Bypass': 235, 'Bhilai Sector-1': 160 },
    { hour: '14:00', 'Siltara Hub': 295, 'Urla Bypass': 240, 'Bhilai Sector-1': 155 },
    { hour: '16:00', 'Siltara Hub': 270, 'Urla Bypass': 215, 'Bhilai Sector-1': 145 },
    { hour: '18:00', 'Siltara Hub': 310, 'Urla Bypass': 250, 'Bhilai Sector-1': 152 },
    { hour: '20:00', 'Siltara Hub': 285, 'Urla Bypass': 220, 'Bhilai Sector-1': 140 },
    { hour: '22:00', 'Siltara Hub': 220, 'Urla Bypass': 195, 'Bhilai Sector-1': 135 }
  ];

  if (loading || !weather || aqiList.length === 0 || !traffic) {
    return (
      <div className="space-y-6">
        {/* Shimmer loading layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shimmer h-28 border border-white/5 bg-[#0C1226]/50 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shimmer lg:col-span-2 h-[450px] border border-white/5 bg-[#0C1226]/50 rounded-xl" />
          <Card className="shimmer h-[450px] border border-white/5 bg-[#0C1226]/50 rounded-xl" />
        </div>
      </div>
    );
  }

  // Calculate average AQI across regional monitoring points
  const avgAQI = Math.round(aqiList.reduce((acc, curr) => acc + curr.aqi, 0) / aqiList.length);

  return (
    <div className="space-y-6">
      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* AQI Summary */}
        <Card className="glass-panel border-white/5 glass-panel-hover" onClick={() => navigate('/aqi')}>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Corridor Avg AQI
              </span>
              <h2 className="text-3xl font-extrabold text-foreground font-mono leading-none m-0">
                {avgAQI}
              </h2>
              <Badge variant={avgAQI > 200 ? 'destructive' : avgAQI > 100 ? 'warning' : 'success'}>
                {avgAQI > 200 ? 'Poor' : avgAQI > 100 ? 'Moderate' : 'Good'}
              </Badge>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Activity className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Traffic Load */}
        <Card className="glass-panel border-white/5 glass-panel-hover" onClick={() => navigate('/traffic')}>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Heavy Vehicles Load
              </span>
              <h2 className="text-3xl font-extrabold text-foreground font-mono leading-none m-0">
                {traffic.heavyVehicleDensity} <span className="text-xs font-semibold text-muted-foreground">trucks/km</span>
              </h2>
              <Badge variant={traffic.status === 'Heavy' || traffic.status === 'Gridlock' ? 'destructive' : 'secondary'}>
                {traffic.status} Traffic
              </Badge>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Truck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Meteorology */}
        <Card className="glass-panel border-white/5 glass-panel-hover" onClick={() => navigate('/weather')}>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Corridor Wind Vector
              </span>
              <h2 className="text-3xl font-extrabold text-foreground font-mono leading-none m-0 flex items-baseline gap-1">
                {Math.round(weather.windSpeed)} <span className="text-xs font-semibold text-muted-foreground">km/h</span>
              </h2>
              <span className="text-[11px] text-muted-foreground font-bold flex items-center gap-1">
                <Navigation className="h-3 w-3 text-secondary" style={{ transform: `rotate(${weather.windDirection}deg)` }} />
                WNW ({weather.windDirection}°)
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Wind className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Calculated Leakage */}
        <Card className="glass-panel border-white/5 glass-panel-hover" onClick={() => navigate('/simulator')}>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Est. Cargo Dust Leakage
              </span>
              <h2 className="text-3xl font-extrabold text-red-400 font-mono leading-none m-0">
                {simulatedOutputs.totalDailyDustLeakage.toLocaleString()} <span className="text-xs font-semibold text-muted-foreground text-foreground">kg/day</span>
              </h2>
              <span className="text-[11px] text-red-400 font-bold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-red-500" />
                ₹{simulatedOutputs.materialLossValueINR.toLocaleString()} lost value/day
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Main Section: Map & Analytics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: GIS Map Panel */}
        <Card className="lg:col-span-2 glass-panel border-white/5 overflow-hidden flex flex-col h-[480px]">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Real-Time GIS Spatiotemporal Corridor</CardTitle>
              <CardDescription>Raipur–Bhilai transport grid overlays showing dust risks, tracking active units, and monitoring stations.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/map')} className="gap-1">
              <Eye className="h-4 w-4" /> Fullscreen Map
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative">
            <InteractiveMap
              windDirection={weather.windDirection}
              windSpeed={weather.windSpeed}
            />
          </CardContent>
        </Card>

        {/* Right: AQI and Risk Summary Gauge */}
        <Card className="glass-panel border-white/5 flex flex-col justify-between h-[480px]">
          <CardHeader className="pb-2">
            <CardTitle>Spreading Hazard Meter</CardTitle>
            <CardDescription>Calculated risk representing current wind gusts, cargo covers compliance, and corridor humidity index.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center items-center py-2">
            {/* Risk Index Visualizer */}
            <div className="relative flex items-center justify-center h-40 w-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  className="stroke-muted"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  className="transition-all duration-1000 ease-out"
                  stroke={riskIndex > 70 ? '#EF4444' : riskIndex > 35 ? '#F59E0B' : '#10B981'}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 68}
                  strokeDashoffset={2 * Math.PI * 68 * (1 - riskIndex / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold font-mono text-foreground">{riskIndex}%</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Hazard Level</span>
              </div>
            </div>

            <div className={`mt-4 text-center border rounded-xl p-3 max-w-[240px] ${riskStatus.color}`}>
              <p className="font-bold text-xs uppercase tracking-wide leading-none">{riskStatus.label}</p>
              <p className="text-[10px] mt-1 text-muted-foreground leading-normal">{riskStatus.desc}</p>
            </div>
          </CardContent>
          <CardContent className="pt-0 pb-6">
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5"><Droplets className="h-4 w-4" /> Rel. Humidity:</span>
                <span className="font-bold font-mono text-foreground">{weather.humidity}%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5"><Wind className="h-4 w-4" /> Ambient Crosswinds:</span>
                <span className="font-bold font-mono text-foreground">{weather.windSpeed} km/h</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5"><Truck className="h-4 w-4" /> Cover Retrofit Rate:</span>
                <span className="font-bold font-mono text-primary">68% fleet cover</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Bottom Grid: Pollutant trends & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle: Trend chart */}
        <Card className="lg:col-span-2 glass-panel border-white/5">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Corridor PM10 Dust Trends</CardTitle>
                <CardDescription>Comparative hourly particulate readings across major mining corridor toll sectors.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/aqi')} className="gap-1 text-xs">
                Detail Metrics <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <TrendChart
              data={hourlyTrendData}
              xKey="hour"
              dataKeys={['Siltara Hub', 'Urla Bypass', 'Bhilai Sector-1']}
              colors={['#EF4444', '#00E5FF', '#10B981']}
              units={[' ug/m3', ' ug/m3', ' ug/m3']}
              type="area"
            />
          </CardContent>
        </Card>

        {/* Right: Active Alert Panel */}
        <Card className="glass-panel border-white/5 flex flex-col justify-between">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Active Hazards</CardTitle>
                <CardDescription>Anomalies flagged by sensory feedback networks.</CardDescription>
              </div>
              <Badge variant="destructive">{alerts.filter(a => !a.read).length} Alerts</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[220px] divide-y divide-white/5 pr-2">
            {alerts.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground py-10">
                All monitoring nodes report normal levels.
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="py-2.5 space-y-1 text-xs first:pt-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className={`font-bold uppercase tracking-wider text-[8px] ${
                      alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {alert.severity} • {alert.location}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">{alert.timestamp}</span>
                  </div>
                  <p className="font-bold text-foreground leading-snug">{alert.title}</p>
                  <p className="text-[10px] text-muted-foreground leading-normal">{alert.message}</p>
                </div>
              ))
            )}
          </CardContent>
          <CardContent className="pt-4 border-t border-white/5 pb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/recommendations')}
              className="w-full text-xs gap-1.5"
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" /> View AI Operational Directives
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;

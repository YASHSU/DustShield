import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Wind,
  Navigation,
  Truck,
  TrendingUp,
  Droplets,
  ArrowRight,
  Eye,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { TrendChart } from '../components/charts/DashboardCharts';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { fetchLiveWeather, fetchLiveAQI, fetchLiveTraffic } from '../api/environmentalService';
import { AQIReading, WeatherData, TrafficReading, AlertItem } from '../types';
import { calculateDustLeakage } from '../utils/calculations';
import { DEFAULT_SIMULATOR_INPUTS } from '../constants';

interface DashboardProps {
  alerts: AlertItem[];
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80&auto=format&fit=crop';

export const Dashboard: React.FC<DashboardProps> = ({ alerts }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [aqiList, setAqiList] = useState<AQIReading[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [traffic, setTraffic] = useState<TrafficReading | null>(null);

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
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const simulatedOutputs = weather
    ? calculateDustLeakage({
        ...DEFAULT_SIMULATOR_INPUTS,
        windSpeed: Math.round(weather.windSpeed),
        humidity: weather.humidity
      })
    : calculateDustLeakage(DEFAULT_SIMULATOR_INPUTS);

  const computeRiskIndex = () => {
    if (!weather || !traffic) return 55;
    const windComponent = Math.min(30, weather.windSpeed) * 1.2;
    const humidityComponent = Math.max(0, 100 - weather.humidity) * 0.35;
    const trafficComponent = traffic.congestionLevel * 0.3;
    return Math.round(Math.min(100, Math.max(10, windComponent + humidityComponent + trafficComponent)));
  };

  const riskIndex = computeRiskIndex();

  const getRiskStatus = (risk: number) => {
    if (risk < 35) return { label: 'Low Risk', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', desc: 'Favorable hauling conditions.' };
    if (risk < 70) return { label: 'Moderate Risk', color: 'text-amber-700 bg-amber-50 border-amber-200', desc: 'Sprinklers active, covers required.' };
    return { label: 'High Alert', color: 'text-red-700 bg-red-50 border-red-200 animate-pulse', desc: 'Delay fly ash operations. Check seals.' };
  };

  const riskStatus = getRiskStatus(riskIndex);

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
      <>
        <div className="relative h-[420px] bg-gray-200 animate-pulse" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="shimmer h-28" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shimmer lg:col-span-2 h-[450px]" />
            <Card className="shimmer h-[450px]" />
          </div>
        </div>
      </>
    );
  }

  const avgAQI = Math.round(aqiList.reduce((acc, curr) => acc + curr.aqi, 0) / aqiList.length);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[420px] lg:h-[480px] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />

        <div className="relative h-full max-w-[1440px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
          <div className="max-w-xl space-y-5">
            <h1 className="text-3xl lg:text-[2.75rem] font-bold text-white leading-tight tracking-tight">
              DustShield brings air quality monitoring to industrial corridors worldwide.
            </h1>
            <p className="text-base lg:text-lg text-white/90 leading-relaxed">
              Our mission is to provide real-time environmental data to communities, industries, and
              policymakers — empowering them to take action against particulate pollution along
              critical haulage routes.
            </p>
            <Button
              variant="cta"
              size="lg"
              onClick={() => navigate('/map')}
              className="mt-2"
            >
              Explore Corridor Map
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="glass-panel-hover cursor-pointer" onClick={() => navigate('/aqi')}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Corridor Avg AQI
                </span>
                <h2 className="text-3xl font-bold text-foreground font-mono leading-none m-0">{avgAQI}</h2>
                <Badge variant={avgAQI > 200 ? 'destructive' : avgAQI > 100 ? 'warning' : 'success'}>
                  {avgAQI > 200 ? 'Poor' : avgAQI > 100 ? 'Moderate' : 'Good'}
                </Badge>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-[#E02020]">
                <Activity className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel-hover cursor-pointer" onClick={() => navigate('/traffic')}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Heavy Vehicles Load
                </span>
                <h2 className="text-3xl font-bold text-foreground font-mono leading-none m-0">
                  {traffic.heavyVehicleDensity}{' '}
                  <span className="text-xs font-medium text-muted-foreground">trucks/km</span>
                </h2>
                <Badge variant={traffic.status === 'Heavy' || traffic.status === 'Gridlock' ? 'destructive' : 'secondary'}>
                  {traffic.status} Traffic
                </Badge>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300">
                <Truck className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel-hover cursor-pointer" onClick={() => navigate('/weather')}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Corridor Wind Vector
                </span>
                <h2 className="text-3xl font-bold text-foreground font-mono leading-none m-0">
                  {Math.round(weather.windSpeed)}{' '}
                  <span className="text-xs font-medium text-muted-foreground">km/h</span>
                </h2>
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Navigation className="h-3 w-3 text-emerald-600" style={{ transform: `rotate(${weather.windDirection}deg)` }} />
                  WNW ({weather.windDirection}°)
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300">
                <Wind className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel-hover cursor-pointer" onClick={() => navigate('/simulator')}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Est. Cargo Dust Leakage
                </span>
                <h2 className="text-3xl font-bold text-red-600 font-mono leading-none m-0">
                  {simulatedOutputs.totalDailyDustLeakage.toLocaleString()}{' '}
                  <span className="text-xs font-medium text-muted-foreground">kg/day</span>
                </h2>
                <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />₹
                  {simulatedOutputs.materialLossValueINR.toLocaleString()} lost/day
                </span>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map & Risk Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 overflow-hidden flex flex-col h-[480px]">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle>Real-Time GIS Corridor</CardTitle>
                <CardDescription>
                  Raipur–Bhilai transport grid showing dust risks, active units, and monitoring stations.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/map')} className="gap-1">
                <Eye className="h-4 w-4" /> Fullscreen
              </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              <InteractiveMap windDirection={weather.windDirection} windSpeed={weather.windSpeed} />
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between h-[480px]">
            <CardHeader className="pb-2">
              <CardTitle>Spreading Hazard Meter</CardTitle>
              <CardDescription>
                Risk from wind gusts, cargo cover compliance, and corridor humidity.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center items-center py-2">
              <div className="relative flex items-center justify-center h-40 w-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="68" className="stroke-gray-100 dark:stroke-muted" strokeWidth="8" fill="transparent" />
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
                  <span className="text-4xl font-bold font-mono text-foreground">{riskIndex}%</span>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                    Hazard Level
                  </span>
                </div>
              </div>

              <div className={`mt-4 text-center border rounded-2xl p-3 max-w-[240px] ${riskStatus.color}`}>
                <p className="font-bold text-xs uppercase tracking-wide leading-none">{riskStatus.label}</p>
                <p className="text-[11px] mt-1 opacity-70 leading-normal">{riskStatus.desc}</p>
              </div>
            </CardContent>
            <CardContent className="pt-0 pb-6">
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Droplets className="h-4 w-4" /> Rel. Humidity:
                  </span>
                  <span className="font-semibold font-mono">{weather.humidity}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Wind className="h-4 w-4" /> Crosswinds:
                  </span>
                  <span className="font-semibold font-mono">{weather.windSpeed} km/h</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Truck className="h-4 w-4" /> Cover Retrofit:
                  </span>
                  <span className="font-semibold font-mono text-emerald-600">68% fleet</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Corridor PM10 Dust Trends</CardTitle>
                  <CardDescription>
                    Hourly particulate readings across major mining corridor sectors.
                  </CardDescription>
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
                colors={['#E02020', '#3B82F6', '#10B981']}
                units={[' ug/m3', ' ug/m3', ' ug/m3']}
                type="area"
              />
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Active Hazards</CardTitle>
                  <CardDescription>Anomalies flagged by sensory networks.</CardDescription>
                </div>
                <Badge variant="destructive">{alerts.filter((a) => !a.read).length} Alerts</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[220px] divide-y divide-gray-100 dark:divide-white/5">
              {alerts.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground py-10">
                  All monitoring nodes report normal levels.
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="py-3 space-y-1 text-sm first:pt-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <span
                        className={`font-bold uppercase tracking-wider text-[10px] ${
                          alert.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
                        }`}
                      >
                        {alert.severity} • {alert.location}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">{alert.timestamp}</span>
                    </div>
                    <p className="font-semibold leading-snug">{alert.title}</p>
                    <p className="text-xs text-muted-foreground leading-normal">{alert.message}</p>
                  </div>
                ))
              )}
            </CardContent>
            <CardContent className="pt-4 border-t border-gray-100 dark:border-white/5 pb-6">
              <Button variant="outline" size="sm" onClick={() => navigate('/recommendations')} className="w-full text-xs gap-1.5">
                <Sparkles className="h-4 w-4 text-[#E02020]" /> View AI Directives
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

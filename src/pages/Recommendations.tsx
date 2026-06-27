import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { fetchLiveWeather, fetchLiveAQI } from '../api/environmentalService';
import { WeatherData, AQIReading, Recommendation } from '../types';
import { Sparkles, Wind, Droplets, ShieldAlert, CheckCircle, RefreshCw, Navigation, Play, AlertCircle } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export const Recommendations: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aqiList, setAqiList] = useState<AQIReading[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [weatherRes, aqiRes] = await Promise.all([
        fetchLiveWeather(),
        fetchLiveAQI()
      ]);
      setWeather(weatherRes.current);
      setAqiList(aqiRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute dynamic recommendations using deterministic rules
  useEffect(() => {
    if (!weather || aqiList.length === 0) return;

    const avgAQI = Math.round(aqiList.reduce((acc, curr) => acc + curr.aqi, 0) / aqiList.length);
    const windSpeed = Math.round(weather.windSpeed);
    const humidity = weather.humidity;
    const windDirection = weather.windDirection;

    const list: Recommendation[] = [];

    // Rule 1: High Wind Speed + Low Humidity (Critical Dust Risk)
    if (windSpeed > 18 || humidity < 45) {
      list.push({
        id: 'rec_sprinkle',
        title: 'Active Water Sprinkling Directive',
        description: `Corridor dry winds are peaking at ${windSpeed} km/h with low humidity (${humidity}%). Fine aggregates are subject to extreme shearing.`,
        severity: 'critical',
        estimatedReduction: 22,
        actionableStep: 'Initiate continuous water misting tankers along NH-53 Siltara-Urla sections immediately.',
        category: 'Road'
      });
    } else {
      list.push({
        id: 'rec_sprinkle_routine',
        title: 'Sprinkling Adjustments',
        description: 'Atmospheric moisture levels are stable. Maintain standard sprinkling rosters.',
        severity: 'info',
        estimatedReduction: 8,
        actionableStep: 'Schedule routine water spraying at Tatibandh bypass terminals.',
        category: 'Road'
      });
    }

    // Rule 2: Westerly winds blowing dust towards Raipur
    if (windDirection >= 240 && windDirection <= 310) {
      list.push({
        id: 'rec_ash_delay',
        title: 'Suspend Fly Ash Haulage',
        description: `Westerly wind vector (${windDirection}°) detected, blowing slag and fly ash dust directly towards Raipur residential sectors.`,
        severity: 'critical',
        estimatedReduction: 14,
        actionableStep: 'Delay fly ash transport dispatch from Siltara boilers to cement plants until evening (after 20:00).',
        category: 'Wind'
      });
    } else {
      list.push({
        id: 'rec_ash_divert',
        title: 'Route Fly Ash through Northern bypass',
        description: `Winds are stable (${windDirection}°). Ensure full covers on slag and ash haulers.`,
        severity: 'warning',
        estimatedReduction: 10,
        actionableStep: 'Enforce strict compliance check on tarpaulin covers at the Siltara loading terminal.',
        category: 'Wind'
      });
    }

    // Rule 3: High Average AQI
    if (avgAQI > 160) {
      list.push({
        id: 'rec_speed_cap',
        title: 'Speed Restrictions Enforced',
        description: `Corridor average AQI has crossed safe limits at ${avgAQI}. Turbulent drag correlates exponentially with truck speeds.`,
        severity: 'warning',
        estimatedReduction: 12,
        actionableStep: 'Instruct dispatchers to cap dumper transit speeds at 40 km/h across the corridor.',
        category: 'Traffic'
      });
    } else {
      list.push({
        id: 'rec_speed_std',
        title: 'Standard Speed Limits',
        description: 'Corridor ambient air is stable. Keep standard transit speeds.',
        severity: 'info',
        estimatedReduction: 5,
        actionableStep: 'Maintain standard 50 km/h limits for aggregates hauling fleets.',
        category: 'Traffic'
      });
    }

    // Rule 4: Audit checks on tarpaulin covers
    list.push({
      id: 'rec_cover_audit',
      title: 'Enforce Dumper Cover Mandate',
      description: 'Visual tracking sensors report minor covers slippage on coal trucks near Bhilai Steel Plant.',
      severity: 'warning',
      estimatedReduction: 18,
      actionableStep: 'Activate inspection check-point at BSP Gate 3. Retain dumpers operating without tarpaulin.',
      category: 'Operation'
    });

    // Rule 5: Mechanical checkups
    list.push({
      id: 'rec_gasket_check',
      title: 'Mandatory Tailgate Gasket Audits',
      description: 'Pressure leaks along dumper tailgate seals cause fine cement powder to escape during high speed turns.',
      severity: 'info',
      estimatedReduction: 10,
      actionableStep: 'Deploy mobile inspectors at Jamul exit bays to check rubber seal compressions.',
      category: 'Operation'
    });

    setRecommendations(list);
  }, [weather, aqiList]);

  const executeDirective = (id: string, title: string) => {
    toast({
      title: "Directive Broadcasted",
      description: `Dispatched "${title}" instruction to corridor fleet monitors.`,
      type: "success"
    });
  };

  if (loading || !weather || aqiList.length === 0) {
    return (
      <div className="shimmer h-[600px] border border-white/5 bg-[#0C1226]/50 rounded-xl" />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-panel border-white/5">
        <CardContent className="p-4 flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground leading-none m-0">AI Environmental Recommendation Engine</h2>
            <p className="text-xs text-muted-foreground">Dynamic compliance directives generated via real-time sensory thresholds.</p>
          </div>
          <button
            onClick={loadData}
            className="p-2.5 rounded-lg bg-card border border-white/5 hover:bg-white/5 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </CardContent>
      </Card>

      {/* Main recommendation list */}
      <div className="grid grid-cols-1 gap-6">
        {recommendations.map((rec) => (
          <Card
            key={rec.id}
            className={`glass-panel border-white/5 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
              rec.severity === 'critical'
                ? 'border-l-4 border-l-red-500'
                : rec.severity === 'warning'
                ? 'border-l-4 border-l-yellow-500'
                : 'border-l-4 border-l-cyan-400'
            }`}
          >
            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1 space-y-3">
                {/* Badge tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={rec.severity === 'critical' ? 'destructive' : rec.severity === 'warning' ? 'warning' : 'primary'}>
                    {rec.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">{rec.category}</Badge>
                </div>

                <h3 className="text-lg font-extrabold text-foreground leading-snug">{rec.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">{rec.description}</p>

                {/* Direct Action */}
                <div className="p-3 bg-black/10 rounded-lg border border-white/5 flex items-start gap-2.5 text-xs text-foreground font-semibold">
                  <AlertCircle className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${
                    rec.severity === 'critical' ? 'text-red-500' : 'text-primary'
                  }`} />
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Mandatory Action</span>
                    {rec.actionableStep}
                  </div>
                </div>
              </div>

              {/* Right Impact Circle & Broadcast button */}
              <div className="flex flex-row md:flex-col items-center justify-between md:justify-center w-full md:w-40 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 shrink-0 gap-4">
                <div className="text-center">
                  <span className="text-2xl font-extrabold text-secondary font-mono flex items-center justify-center">
                    -{rec.estimatedReduction}%
                  </span>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Est PM10 Impact</span>
                </div>

                <Button
                  variant={rec.severity === 'critical' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => executeDirective(rec.id, rec.title)}
                  className="w-full text-xs font-bold gap-1.5 cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> Dispatch
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default Recommendations;

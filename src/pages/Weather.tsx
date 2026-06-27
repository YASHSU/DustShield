import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { fetchLiveWeather } from '../api/environmentalService';
import { WeatherData, ForecastDay } from '../types';
import { Sun, CloudRain, Compass, Eye, Thermometer, Droplets, Gauge, AlertTriangle, ArrowDown, RefreshCw, Wind } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const Weather: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<{ current: WeatherData; forecast: ForecastDay[] } | null>(null);

  const loadWeather = async () => {
    setLoading(true);
    try {
      const data = await fetchLiveWeather();
      setWeatherData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  if (loading || !weatherData) {
    return (
      <div className="shimmer h-[600px] border border-white/5 bg-[#0C1226]/50 rounded-xl" />
    );
  }

  const { current, forecast } = weatherData;

  const getWindDirectionString = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return 'North (N)';
    if (deg >= 22.5 && deg < 67.5) return 'North-East (NE)';
    if (deg >= 67.5 && deg < 112.5) return 'East (E)';
    if (deg >= 112.5 && deg < 157.5) return 'South-East (SE)';
    if (deg >= 157.5 && deg < 202.5) return 'South (S)';
    if (deg >= 202.5 && deg < 247.5) return 'South-West (SW)';
    if (deg >= 247.5 && deg < 292.5) return 'West (W)';
    return 'West-North-West (WNW)';
  };

  return (
    <div className="space-y-6">
      {/* Synchronization Header */}
      <Card className="glass-panel border-white/5">
        <CardContent className="p-4 flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground leading-none m-0">Live Meteorology Feed</h2>
            <p className="text-xs text-muted-foreground">Regional weather patterns directly impact dust dispersion and moisture binding rates.</p>
          </div>
          <button
            onClick={loadWeather}
            className="p-2.5 rounded-lg bg-card border border-white/5 hover:bg-white/5 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </CardContent>
      </Card>

      {/* Main Meteorological Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Temperature Card */}
        <Card className="glass-panel border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ambient Temp</span>
              <h3 className="text-3xl font-extrabold font-mono text-foreground leading-none m-0">
                {current.temperature.toFixed(1)}°C
              </h3>
              <span className="text-[10px] text-muted-foreground">High dust sublimation point</span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <Thermometer className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Humidity Card */}
        <Card className="glass-panel border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Relative Humidity</span>
              <h3 className="text-3xl font-extrabold font-mono text-foreground leading-none m-0">
                {current.humidity}%
              </h3>
              <Badge variant={current.humidity > 50 ? 'success' : 'warning'}>
                {current.humidity > 50 ? 'Favorable Moisture' : 'High Dryness Risk'}
              </Badge>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Droplets className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Wind Speed Card */}
        <Card className="glass-panel border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Wind Velocity</span>
              <h3 className="text-3xl font-extrabold font-mono text-foreground leading-none m-0">
                {current.windSpeed.toFixed(1)} <span className="text-xs text-muted-foreground">km/h</span>
              </h3>
              <Badge variant={current.windSpeed > 20 ? 'destructive' : 'secondary'}>
                {current.windSpeed > 20 ? 'High Shearing' : 'Moderate Flow'}
              </Badge>
            </div>
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Wind className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* UV Index Card */}
        <Card className="glass-panel border-white/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">UV Solar Index</span>
              <h3 className="text-3xl font-extrabold font-mono text-foreground leading-none m-0">
                {current.uvIndex} <span className="text-xs text-muted-foreground">of 11</span>
              </h3>
              <span className="text-[10px] text-yellow-500 font-bold uppercase">Very High Intensity</span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
              <Sun className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wind and Sub-parameter details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wind Vector Vector Analysis */}
        <Card className="glass-panel border-white/5">
          <CardHeader>
            <CardTitle>Crosswind Vector Analysis</CardTitle>
            <CardDescription>Visualizing ambient wind direction causing downwind particulate carrying.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative h-32 w-32 rounded-full border border-white/10 flex items-center justify-center bg-black/10">
              {/* Compass points */}
              <span className="absolute top-1 text-[8px] font-bold text-muted-foreground">N</span>
              <span className="absolute right-2 text-[8px] font-bold text-muted-foreground">E</span>
              <span className="absolute bottom-1 text-[8px] font-bold text-muted-foreground">S</span>
              <span className="absolute left-2 text-[8px] font-bold text-muted-foreground">W</span>
              {/* Rotating pointer */}
              <div
                className="h-20 w-2 bg-primary rounded-full transition-transform duration-500 shadow-md shadow-primary/40"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">{getWindDirectionString(current.windDirection)}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Bearing angle: {current.windDirection}°</p>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Parameters */}
        <Card className="lg:col-span-2 glass-panel border-white/5">
          <CardHeader>
            <CardTitle>Ambient Sensor Metrics</CardTitle>
            <CardDescription>Frictional and pressure telemetry reports from Raipur Airport Met center.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/5 bg-card/40 flex items-center gap-4">
              <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                <Gauge className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Atmospheric Pressure</span>
                <p className="text-lg font-bold font-mono text-foreground m-0">{current.pressure} hPa</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-card/40 flex items-center gap-4">
              <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                <Eye className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Horizontal Visibility</span>
                <p className="text-lg font-bold font-mono text-foreground m-0">{current.visibility} km</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-card/40 flex items-center gap-4">
              <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                <CloudRain className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Precipitation Chance</span>
                <p className="text-lg font-bold font-mono text-foreground m-0">{current.rainProbability}%</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-card/40 flex items-center gap-4">
              <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                <Compass className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Geo Coordinates</span>
                <p className="text-sm font-bold font-mono text-foreground m-0">21.251° N, 81.630° E</p>
              </div>
            </div>
          </CardContent>
          <CardContent className="pt-2">
            <div className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-xs text-yellow-500 flex items-start gap-2">
              <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
              <p className="m-0 leading-relaxed font-semibold">
                High evaporation index ({current.temperature > 35 ? 'Critical' : 'Normal'}) triggers rapid road water dispersion. Sprinklers should increase scheduling cycles by 25% on dust haulage routes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 7-Day Forecast Grid */}
      <Card className="glass-panel border-white/5">
        <CardHeader>
          <CardTitle>7-Day Meteorological Outlook</CardTitle>
          <CardDescription>Proactive operations scheduling by tracking wind vectors and rain profiles over the week.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {forecast.map((day, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-white/5 bg-card/30 flex flex-col justify-between items-center text-center space-y-3 hover:border-primary/20 hover:bg-card/50 transition-all duration-200"
            >
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{day.date}</span>
              
              {/* Condition Icon */}
              <div className="h-10 w-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                {day.condition === 'Sunny' && <Sun className="h-5 w-5 text-yellow-400" />}
                {day.condition === 'Rainy' && <CloudRain className="h-5 w-5 text-blue-400" />}
                {day.condition === 'Windy' && <Wind className="h-5 w-5 text-cyan-400 animate-pulse" />}
                {day.condition === 'Cloudy' && <Compass className="h-5 w-5 text-muted-foreground" />}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground">
                  {Math.round(day.tempMax)}° <span className="text-muted-foreground font-normal">{Math.round(day.tempMin)}°</span>
                </p>
                <p className="text-[9px] text-muted-foreground">{day.condition}</p>
              </div>

              <div className="w-full border-t border-white/5 pt-2 flex flex-col space-y-1 text-[9px] text-muted-foreground">
                <span className="flex items-center justify-between">
                  <span>Rain:</span>
                  <span className="font-bold text-foreground font-mono">{day.rainProbability}%</span>
                </span>
                <span className="flex items-center justify-between">
                  <span>Wind:</span>
                  <span className="font-bold text-foreground font-mono">{day.windSpeedMax} km/h</span>
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
export default Weather;

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { fetchLiveWeather, fetchLiveAQI } from '../api/environmentalService';
import { AQIReading, WeatherData } from '../types';
import { Layers, Activity, ShieldAlert, CheckCircle, Navigation, MapPin } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const MapPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [aqiList, setAqiList] = useState<AQIReading[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedStationIndex, setSelectedStationIndex] = useState<number | null>(0);

  useEffect(() => {
    async function loadData() {
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
    }
    loadData();
  }, []);

  const handleSelectStation = (stationId: string) => {
    const idx = aqiList.findIndex(st => st.stationName.includes(stationId) || stationId.includes(st.stationName));
    if (idx !== -1) {
      setSelectedStationIndex(idx);
    } else {
      // Direct comparison matching if id or name differs slightly
      const foundIdx = aqiList.findIndex(st => st.stationName.toLowerCase().slice(0, 5) === stationId.toLowerCase().slice(3, 8));
      if (foundIdx !== -1) {
        setSelectedStationIndex(foundIdx);
      }
    }
  };

  if (loading || aqiList.length === 0 || !weather) {
    return (
      <div className="shimmer h-[600px] border border-white/5 bg-[#0C1226]/50 rounded-xl" />
    );
  }

  const selectedStation = selectedStationIndex !== null ? aqiList[selectedStationIndex] : null;

  return (
    <div className="space-y-6">
      {/* Controls and Title */}
      <Card className="glass-panel border-white/5">
        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground leading-none m-0">Industrial Corridor GIS Mapping</h2>
            <p className="text-xs text-muted-foreground">Interactive spatial tracking layer covering factories, stations, and moving truck units.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-card/60 border border-white/5 px-2.5 py-1 rounded-md">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span> Stations Active
            </span>
            <span className="flex items-center gap-1.5 bg-card/60 border border-white/5 px-2.5 py-1 rounded-md">
              <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span> Haulers Moving
            </span>
            <span className="flex items-center gap-1.5 bg-card/60 border border-white/5 px-2.5 py-1 rounded-md">
              <span className="h-2 w-2 rounded-full bg-red-600"></span> Factories Bound
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Leaflet Map */}
        <div className="lg:col-span-3 h-[520px] rounded-xl overflow-hidden shadow-2xl relative border border-white/5">
          <InteractiveMap
            windDirection={weather.windDirection}
            windSpeed={weather.windSpeed}
            selectedStation={selectedStation?.stationName}
            onSelectStation={handleSelectStation}
          />
        </div>

        {/* Right Side: Selected Node Inspectors */}
        <div className="space-y-6">
          <Card className="glass-panel border-white/5 h-[520px] flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-1.5 text-sm">
                <MapPin className="h-4.5 w-4.5 text-primary" /> Station Inspector
              </CardTitle>
              <CardDescription>Click any station marker on the map to review real-time parameters.</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto space-y-4 pr-1">
              {selectedStation ? (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-snug">{selectedStation.stationName}</h3>
                    <span className="text-[10px] text-muted-foreground font-mono">Sync: {selectedStation.timestamp}</span>
                  </div>

                  {/* Primary AQI Indicator */}
                  <div className="p-4 rounded-xl border border-white/5 bg-card/40 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Corridor AQI</span>
                      <h4 className="text-3xl font-extrabold font-mono text-foreground mt-1 leading-none">{selectedStation.aqi}</h4>
                    </div>
                    <Badge variant={selectedStation.aqi > 200 ? 'destructive' : selectedStation.aqi > 100 ? 'warning' : 'success'}>
                      {selectedStation.status}
                    </Badge>
                  </div>

                  {/* Pollutant levels */}
                  <div className="space-y-2.5 pt-2 border-t border-white/5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pollutants Breakdown</span>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">PM10 (Dust):</span>
                      <span className="font-mono text-foreground font-bold">{Math.round(selectedStation.pollutants.pm10)} µg/m³</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">PM2.5 (Fine):</span>
                      <span className="font-mono text-foreground font-bold">{Math.round(selectedStation.pollutants.pm25)} µg/m³</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">NO2 (Gas):</span>
                      <span className="font-mono text-foreground font-bold">{Math.round(selectedStation.pollutants.no2)} µg/m³</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">SO2 (Coal):</span>
                      <span className="font-mono text-foreground font-bold">{Math.round(selectedStation.pollutants.so2)} µg/m³</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">CO (Traffic):</span>
                      <span className="font-mono text-foreground font-bold">{selectedStation.pollutants.co.toFixed(1)} mg/m³</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground text-center py-20">
                  Select a monitoring node from the map to load telemetry details.
                </div>
              )}
            </CardContent>

            <CardContent className="pt-4 border-t border-white/5 pb-6">
              <div className="p-3 rounded-lg border border-white/5 bg-[#0E1528] text-[9px] text-muted-foreground space-y-1.5">
                <p className="font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-primary" /> Active Layers
                </p>
                <div className="flex justify-between">
                  <span>TomTom Traffic Grid:</span>
                  <span className="text-emerald-400 font-bold">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span>OpenAQ Ambient:</span>
                  <span className="text-emerald-400 font-bold">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span>OSM Base Layer:</span>
                  <span className="text-emerald-400 font-bold">Enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default MapPage;

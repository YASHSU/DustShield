import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { AQIGauge, TrendChart, PollutantsRadarChart } from '../components/charts/DashboardCharts';
import { fetchLiveAQI } from '../api/environmentalService';
import { AQIReading } from '../types';
import { AlertCircle, CheckCircle, ShieldAlert, Thermometer, Wind, RefreshCw } from 'lucide-react';

export const AirQuality: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [aqiList, setAqiList] = useState<AQIReading[]>([]);
  const [selectedStationIndex, setSelectedStationIndex] = useState<number>(0);

  const loadAQI = async () => {
    setLoading(true);
    try {
      const data = await fetchLiveAQI();
      setAqiList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAQI();
  }, []);

  if (loading || aqiList.length === 0) {
    return (
      <div className="shimmer h-[600px] border border-white/5 bg-[#0C1226]/50 rounded-xl" />
    );
  }

  const currentStation = aqiList[selectedStationIndex];
  const { aqi, status, pollutants, stationName, timestamp } = currentStation;

  // Set up station select options
  const stationOptions = aqiList.map((item, idx) => ({
    value: idx.toString(),
    label: item.stationName
  }));

  // Pollutant standards in India (NAAQS limits)
  const standards = {
    pm10: 100, // 24-hr standard (ug/m3)
    pm25: 60,  // 24-hr standard (ug/m3)
    no2: 80,   // 24-hr standard (ug/m3)
    so2: 80,   // 24-hr standard (ug/m3)
    co: 2.0,   // 8-hr standard (mg/m3)
    o3: 100    // 8-hr standard (ug/m3)
  };

  // Convert current pollutant data to Radar format
  const radarData = [
    { parameter: 'PM10 (Dust)', current: Math.round(pollutants.pm10), standard: standards.pm10 },
    { parameter: 'PM2.5 (Fine)', current: Math.round(pollutants.pm25), standard: standards.pm25 },
    { parameter: 'NO2 (Gas)', current: Math.round(pollutants.no2), standard: standards.no2 },
    { parameter: 'SO2 (Coal)', current: Math.round(pollutants.so2), standard: standards.so2 },
    { parameter: 'CO (Traffic)', current: Math.round(pollutants.co * 50), standard: standards.co * 50 }, // Scaled for visual comparison
    { parameter: 'Ozone', current: Math.round(pollutants.o3), standard: standards.o3 }
  ];

  // Mock hourly and daily trend graphs
  const hourlyData = [
    { hour: '00:00', PM10: Math.round(pollutants.pm10 * 0.8), PM25: Math.round(pollutants.pm25 * 0.8) },
    { hour: '04:00', PM10: Math.round(pollutants.pm10 * 0.7), PM25: Math.round(pollutants.pm25 * 0.75) },
    { hour: '08:00', PM10: Math.round(pollutants.pm10 * 1.1), PM25: Math.round(pollutants.pm25 * 1.1) },
    { hour: '12:00', PM10: Math.round(pollutants.pm10 * 1.25), PM25: Math.round(pollutants.pm25 * 1.2) },
    { hour: '16:00', PM10: Math.round(pollutants.pm10 * 1.15), PM25: Math.round(pollutants.pm25 * 1.1) },
    { hour: '20:00', PM10: Math.round(pollutants.pm10 * 1.3), PM25: Math.round(pollutants.pm25 * 1.25) }
  ];

  const dailyData = [
    { day: 'Mon', PM10: Math.round(pollutants.pm10 * 0.9), PM25: Math.round(pollutants.pm25 * 0.95) },
    { day: 'Tue', PM10: Math.round(pollutants.pm10 * 1.05), PM25: Math.round(pollutants.pm25 * 1.0) },
    { day: 'Wed', PM10: Math.round(pollutants.pm10 * 1.15), PM25: Math.round(pollutants.pm25 * 1.1) },
    { day: 'Thu', PM10: Math.round(pollutants.pm10 * 1.2), PM25: Math.round(pollutants.pm25 * 1.15) },
    { day: 'Fri', PM10: Math.round(pollutants.pm10 * 1.1), PM25: Math.round(pollutants.pm25 * 1.05) },
    { day: 'Sat', PM10: Math.round(pollutants.pm10 * 0.85), PM25: Math.round(pollutants.pm25 * 0.85) },
    { day: 'Sun', PM10: Math.round(pollutants.pm10 * 0.8), PM25: Math.round(pollutants.pm25 * 0.8) }
  ];

  const monthlyData = [
    { month: 'Jan', PM10: 195, PM25: 110 },
    { month: 'Feb', PM10: 180, PM25: 98 },
    { month: 'Mar', PM10: 165, PM25: 90 },
    { month: 'Apr', PM10: 210, PM25: 118 },
    { month: 'May', PM10: 245, PM25: 145 },
    { month: 'Jun', PM10: 152, PM25: 64 } // Monsoon decrease
  ];

  const getComplianceStatus = (val: number, standard: number) => {
    if (val <= standard) {
      return { text: 'Compliant', color: 'text-secondary bg-secondary/10 border-secondary/20', icon: CheckCircle };
    }
    const exceedance = Math.round(((val - standard) / standard) * 100);
    return {
      text: `${exceedance}% Exceedance`,
      color: exceedance > 100 ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
      icon: ShieldAlert
    };
  };

  return (
    <div className="space-y-6">
      {/* Station Selector Bar */}
      <Card className="glass-panel border-white/5">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-sm">
            <Select
              label="Select Air Quality Station"
              options={stationOptions}
              value={selectedStationIndex.toString()}
              onChange={(e) => setSelectedStationIndex(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
            <div className="text-xs">
              <span className="text-muted-foreground">Last Sensor Sync:</span>{' '}
              <span className="font-mono text-foreground font-bold">{timestamp}</span>
            </div>
            <button
              onClick={loadAQI}
              className="p-2.5 rounded-lg bg-card border border-white/5 hover:bg-white/5 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Speedometer Gauge vs Profile Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Speedometer */}
        <Card className="glass-panel border-white/5 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Corridor Index Gauge</CardTitle>
            <CardDescription>Real-time index calculated via EPA guidelines representing primary dust components.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-0">
            <AQIGauge value={aqi} stationName={stationName} />
          </CardContent>
        </Card>

        {/* Profile Radar */}
        <Card className="lg:col-span-2 glass-panel border-white/5">
          <CardHeader>
            <CardTitle>Sensory Profile vs National Standard</CardTitle>
            <CardDescription>Comparison of 6 major parameters against India\'s National Ambient Air Quality Standards (NAAQS).</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <PollutantsRadarChart data={radarData} />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Parameter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(pollutants).map(([key, val]) => {
          const std = standards[key as keyof typeof standards] || 80;
          const label = key === 'pm10' ? 'PM10 (Coarse Dust)' : key === 'pm25' ? 'PM2.5 (Fine Dust)' : key.toUpperCase();
          const unit = key === 'co' ? 'mg/m³' : 'µg/m³';
          const compliance = getComplianceStatus(val, std);
          const Icon = compliance.icon;

          return (
            <Card key={key} className="glass-panel border-white/5">
              <CardContent className="p-5 flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
                    <h3 className="text-2xl font-extrabold font-mono text-foreground m-0">
                      {val.toFixed(1)} <span className="text-xs font-semibold text-muted-foreground font-sans">{unit}</span>
                    </h3>
                  </div>
                  <div className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] font-bold leading-none ${compliance.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                    <span>{compliance.text}</span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-white/5 pt-3">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>NAAQS Standard Limit:</span>
                    <span className="font-mono text-foreground font-semibold">{std} {unit}</span>
                  </div>
                  <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        val > std ? 'bg-destructive' : 'bg-secondary'
                      }`}
                      style={{ width: `${Math.min(100, (val / std) * 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hourly / Daily / Monthly Trend Panel */}
      <Card className="glass-panel border-white/5">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Historical Particulate Trend Analysis</CardTitle>
              <CardDescription>Visual comparisons tracking PM10 (Heavy road dust) vs PM2.5 (Fine emissions) over multiple timelines.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Hourly Trends (Haulage Peaks)</span>
              <TrendChart data={hourlyData} xKey="hour" dataKeys={['PM10', 'PM2.5']} colors={['#00E5FF', '#10B981']} units={[' ug/m3', ' ug/m3']} type="area" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Daily Trends (Weekly Loading Cycles)</span>
              <TrendChart data={dailyData} xKey="day" dataKeys={['PM10', 'PM2.5']} colors={['#00E5FF', '#10B981']} units={[' ug/m3', ' ug/m3']} type="bar" />
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-white/5">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Monthly Averages (Monsoon Impact)</span>
            <TrendChart data={monthlyData} xKey="month" dataKeys={['PM10', 'PM2.5']} colors={['#00E5FF', '#10B981']} units={[' ug/m3', ' ug/m3']} type="line" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AirQuality;

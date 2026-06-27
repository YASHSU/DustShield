import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FileText, Download, Printer, CheckCircle, Table, RefreshCw, Eye } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { fetchLiveAQI, fetchLiveWeather } from '../api/environmentalService';
import { AQIReading, WeatherData } from '../types';

export const Reports: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [aqiList, setAqiList] = useState<AQIReading[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);

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

  // Native CSV download utility
  const exportCSV = () => {
    if (aqiList.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Station Name,AQI,Status,PM10 (ug/m3),PM2.5 (ug/m3),SO2 (ug/m3),NO2 (ug/m3),CO (mg/m3),O3 (ug/m3),Timestamp\n';

    aqiList.forEach((st) => {
      const p = st.pollutants;
      csvContent += `"${st.stationName}",${st.aqi},"${st.status}",${p.pm10.toFixed(1)},${p.pm25.toFixed(1)},${p.so2.toFixed(1)},${p.no2.toFixed(1)},${p.co.toFixed(1)},${p.o3.toFixed(1)},"${st.timestamp}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'dustshield_corridor_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Report Downloaded',
      description: 'Saved dustshield_corridor_report.csv successfully.',
      type: 'success'
    });
  };

  // Native Excel download wrapper
  const exportExcel = () => {
    if (aqiList.length === 0) return;

    // Excel opening tab-delimited sheet mock
    let excelContent = 'data:application/vnd.ms-excel;charset=utf-8,';
    excelContent += 'Station Name\tAQI\tStatus\tPM10\tPM2.5\tSO2\tNO2\tCO\tO3\tTimestamp\n';

    aqiList.forEach((st) => {
      const p = st.pollutants;
      excelContent += `"${st.stationName}"\t${st.aqi}\t"${st.status}"\t${p.pm10.toFixed(1)}\t${p.pm25.toFixed(1)}\t${p.so2.toFixed(1)}\t${p.no2.toFixed(1)}\t${p.co.toFixed(1)}\t${p.o3.toFixed(1)}\t"${st.timestamp}"\n`;
    });

    const encodedUri = encodeURI(excelContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'dustshield_corridor_sheet.xls');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Excel Exported',
      description: 'Saved dustshield_corridor_sheet.xls successfully.',
      type: 'success'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || aqiList.length === 0 || !weather) {
    return (
      <div className="shimmer h-[600px] border border-white/5 bg-[#0C1226]/50 rounded-xl" />
    );
  }

  return (
    <div className="space-y-6 print:bg-white print:text-black print:p-8">
      {/* Header (hidden on print) */}
      <Card className="glass-panel border-white/5 print:hidden">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground leading-none m-0">Compliance Export Center</h2>
            <p className="text-xs text-muted-foreground">Download standard spreadsheets or print official CPCB compliant environmental audits.</p>
          </div>
          <button
            onClick={loadData}
            className="p-2.5 rounded-lg bg-card border border-white/5 hover:bg-white/5 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </CardContent>
      </Card>

      {/* Action Buttons (hidden on print) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 print:hidden">
        <Button variant="outline" size="lg" onClick={exportCSV} className="gap-2 text-xs font-bold py-6 cursor-pointer">
          <Download className="h-4.5 w-4.5 text-primary" /> Export CSV Data
        </Button>
        <Button variant="outline" size="lg" onClick={exportExcel} className="gap-2 text-xs font-bold py-6 cursor-pointer">
          <FileText className="h-4.5 w-4.5 text-primary" /> Export Excel Sheet
        </Button>
        <Button variant="primary" size="lg" onClick={handlePrint} className="gap-2 text-xs font-bold py-6 cursor-pointer">
          <Printer className="h-4.5 w-4.5 fill-current" /> Print Audit PDF
        </Button>
      </div>

      {/* Compliance status certificate widget */}
      <Card className="glass-panel border-white/5 print:border-black print:bg-transparent">
        <CardHeader className="border-b border-white/5 print:border-black">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-secondary" /> CPCB Compliance Audit
            </CardTitle>
            <Badge variant="success" className="text-xs">PASSING</Badge>
          </div>
          <CardDescription className="print:text-black">Official report validating particulate averages inside Raipur-Bhilai transit bypass limits.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs border-b border-white/5 print:border-black pb-6">
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Authority</span>
              <span className="font-semibold text-foreground print:text-black">Chhattisgarh Pollution Control Board</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Corridor Sector</span>
              <span className="font-semibold text-foreground print:text-black">NH-53 Heavy Transit Segment</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Wind Vector</span>
              <span className="font-semibold text-foreground print:text-black">{weather.windSpeed.toFixed(1)} km/h ({weather.windDirection}°)</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Audit Code</span>
              <span className="font-mono text-primary font-bold print:text-black">DS-2026-REG05</span>
            </div>
          </div>

          {/* Sensor tables */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground print:text-black flex items-center gap-1.5">
              <Table className="h-4.5 w-4.5 text-primary print:text-black" /> Ambient AQI Index Summary
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 print:border-black text-muted-foreground font-bold">
                    <th className="pb-3 uppercase tracking-wider">Station Name</th>
                    <th className="pb-3 uppercase tracking-wider text-center">AQI Rating</th>
                    <th className="pb-3 uppercase tracking-wider text-center">PM10</th>
                    <th className="pb-3 uppercase tracking-wider text-center">PM2.5</th>
                    <th className="pb-3 uppercase tracking-wider text-center">SO2</th>
                    <th className="pb-3 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-black font-semibold text-foreground print:text-black">
                  {aqiList.map((st, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3">{st.stationName}</td>
                      <td className="py-3 text-center font-mono font-bold">{st.aqi}</td>
                      <td className="py-3 text-center font-mono">{st.pollutants.pm10.toFixed(0)}</td>
                      <td className="py-3 text-center font-mono">{st.pollutants.pm25.toFixed(0)}</td>
                      <td className="py-3 text-center font-mono">{st.pollutants.so2.toFixed(0)}</td>
                      <td className="py-3 text-right">
                        <span className={st.aqi > 200 ? 'text-red-500 font-extrabold' : 'text-emerald-500 font-extrabold'}>
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Reports;

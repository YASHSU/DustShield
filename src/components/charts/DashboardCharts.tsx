import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Custom dark themed Tooltip for Recharts
export const ChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg border border-white/10 shadow-xl text-xs space-y-1.5 animate-fade-in">
        {label && <p className="font-bold text-foreground border-b border-white/5 pb-1 mb-1">{label}</p>}
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
            <span className="text-muted-foreground capitalize">{item.name}:</span>
            <span className="font-mono font-bold text-foreground">{item.value.toLocaleString()} {item.unit || ''}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// 1. AQI Radial Gauge
interface AQIGaugeProps {
  value: number;
  stationName?: string;
}
export const AQIGauge: React.FC<AQIGaugeProps> = ({ value, stationName }) => {
  const capValue = Math.min(500, Math.max(0, value));
  
  // Custom Indian AQI bands
  const getAQIInfo = (val: number) => {
    if (val <= 50) return { label: 'Good', color: '#10B981', desc: 'Minimal impact' };
    if (val <= 100) return { label: 'Satisfactory', color: '#34D399', desc: 'Minor breathing discomfort' };
    if (val <= 200) return { label: 'Moderate', color: '#FBBF24', desc: 'Breathing discomfort to asthma/heart patients' };
    if (val <= 300) return { label: 'Poor', color: '#F97316', desc: 'Breathing discomfort on prolonged exposure' };
    if (val <= 400) return { label: 'Very Poor', color: '#EF4444', desc: 'Respiratory illness on prolonged exposure' };
    return { label: 'Severe', color: '#7F1D1D', desc: 'Affects healthy people, impacts those with diseases' };
  };

  const info = getAQIInfo(capValue);
  
  // Angle calculations for the speedometer pointer
  const startAngle = 180;
  const endAngle = 0;
  const angleDiff = startAngle - endAngle;
  const targetAngle = startAngle - (capValue / 500) * angleDiff;
  const radian = Math.PI / 180;
  const cx = 150;
  const cy = 135;
  const r = 90;
  
  const pointerX = cx + r * Math.cos(targetAngle * radian);
  const pointerY = cy - r * Math.sin(targetAngle * radian);

  const gaugeData = [
    { name: 'Good', value: 50, color: '#10B981' },
    { name: 'Satisfactory', value: 50, color: '#34D399' },
    { name: 'Moderate', value: 100, color: '#FBBF24' },
    { name: 'Poor', value: 100, color: '#F97316' },
    { name: 'Very Poor', value: 100, color: '#EF4444' },
    { name: 'Severe', value: 100, color: '#7F1D1D' }
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4 relative w-full h-[230px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={gaugeData}
            cx={cx}
            cy={cy}
            startAngle={180}
            endAngle={0}
            innerRadius={75}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
          >
            {gaugeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Speedometer Pointer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: '100%', height: '100%' }}>
        <circle cx={cx} cy={cy} r={8} fill="#ffffff" />
        <line
          x1={cx}
          y1={cy}
          x2={pointerX}
          y2={pointerY}
          stroke="#ffffff"
          strokeWidth={4}
          strokeLinecap="round"
        />
      </svg>

      {/* Central Value */}
      <div className="absolute top-[85px] text-center flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold tracking-tight font-mono text-foreground glow-text-primary" style={{ textShadow: `0 0 10px ${info.color}40` }}>
          {value}
        </span>
        <span
          className="text-xs font-bold px-2 py-0.5 mt-1 rounded-md"
          style={{ backgroundColor: `${info.color}15`, color: info.color }}
        >
          {info.label}
        </span>
      </div>

      <div className="absolute bottom-2 text-center w-full px-4">
        {stationName && <p className="text-xs font-bold text-muted-foreground truncate">{stationName}</p>}
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{info.desc}</p>
      </div>
    </div>
  );
};

// 2. Trend Area Chart (Weather/AQI Trends)
interface TrendChartProps {
  data: any[];
  xKey: string;
  dataKeys: string[];
  colors?: string[];
  units?: string[];
  type?: 'area' | 'line' | 'bar';
}
export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  xKey,
  dataKeys,
  colors = ['#00E5FF', '#10B981'],
  units = ['', ''],
  type = 'area'
}) => {
  return (
    <div className="h-[280px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {dataKeys.map((key, i) => (
                <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[i]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors[i]} stopOpacity={0.0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey={xKey}
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
            {dataKeys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i]}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#color-${key})`}
                unit={units[i]}
              />
            ))}
          </AreaChart>
        ) : type === 'bar' ? (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey={xKey}
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            {dataKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[i]}
                radius={[4, 4, 0, 0]}
                unit={units[i]}
              />
            ))}
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey={xKey}
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            {dataKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                unit={units[i]}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

// 3. Radar Chart (Pollutants Profile)
interface RadarPollutantProps {
  data: { parameter: string; current: number; standard: number }[];
}
export const PollutantsRadarChart: React.FC<RadarPollutantProps> = ({ data }) => {
  return (
    <div className="h-[280px] w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.05)" />
          <PolarAngleAxis dataKey="parameter" stroke="rgba(255,255,255,0.5)" fontSize={10} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="rgba(255,255,255,0.2)" fontSize={9} />
          <Tooltip content={<ChartTooltip />} />
          <Radar name="Current Ambient" dataKey="current" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.25} />
          <Radar name="NAAQS Standard" dataKey="standard" stroke="#EF4444" fill="#EF4444" fillOpacity={0.05} strokeDasharray="3 3" />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

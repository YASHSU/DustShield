import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { REGION_CENTER, DEFAULT_ZOOM, INDUSTRIAL_ZONES, AQI_STATIONS, TRUCK_ROUTES } from '../../constants';
import { IndustrialZone, StationData, RouteDetails } from '../../types';
import { Shield, Truck, Wind, AlertCircle } from 'lucide-react';

// Solve Leaflet marker icon asset resolution issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom styling helper for AQI colors
const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return '#10B981'; // Good
  if (aqi <= 100) return '#34D399'; // Satisfactory
  if (aqi <= 200) return '#FBBF24'; // Moderate
  if (aqi <= 300) return '#F97316'; // Poor
  if (aqi <= 400) return '#EF4444'; // Very Poor
  return '#7F1D1D'; // Severe
};

// Create custom glowing HTML DivIcons
const createStationIcon = (aqi: number) => {
  const color = getAQIColor(aqi);
  return L.divIcon({
    html: `<div class="relative flex items-center justify-center h-8 w-8">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style="background-color: ${color}"></span>
      <span class="relative inline-flex rounded-full h-5 w-5 items-center justify-center text-[10px] font-extrabold text-[#050B14] border border-white/20" style="background-color: ${color}">
        ${aqi}
      </span>
    </div>`,
    className: 'custom-station-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const createZoneIcon = (pollutionIndex: number) => {
  const size = 20 + (pollutionIndex - 60) * 0.5; // Scale with pollution level
  return L.divIcon({
    html: `<div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px;">
      <div class="absolute inset-0 rounded-full bg-red-500/20 border border-red-500/50 animate-pulse-slow"></div>
      <div class="h-2 w-2 rounded-full bg-red-500"></div>
    </div>`,
    className: 'custom-zone-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

interface InteractiveMapProps {
  windDirection: number;
  windSpeed: number;
  selectedStation?: string;
  onSelectStation?: (stationId: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  windDirection,
  windSpeed,
  selectedStation,
  onSelectStation
}) => {
  // Animating simulated trucks along routes
  const [truckPositions, setTruckPositions] = useState<{ [key: string]: [number, number] }>({});

  useEffect(() => {
    // Basic truck movement simulation
    const interval = setInterval(() => {
      const time = Date.now() / 20000; // speeds up movement
      const positions: { [key: string]: [number, number] } = {};

      TRUCK_ROUTES.forEach((route) => {
        const coords = route.coordinates;
        if (coords.length < 2) return;

        // Calculate current segment index based on time and path lengths
        const segmentCount = coords.length - 1;
        const progress = (time % 1); // 0 to 1 loop
        const exactSegment = progress * segmentCount;
        const segmentIndex = Math.floor(exactSegment);
        const ratio = exactSegment - segmentIndex;

        const start = coords[segmentIndex];
        const end = coords[segmentIndex + 1];

        // Linear interpolation
        const lat = start[0] + (end[0] - start[0]) * ratio;
        const lng = start[1] + (end[1] - start[1]) * ratio;
        positions[route.id] = [lat, lng];
      });

      setTruckPositions(positions);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-[#050914] z-10">
      <MapContainer
        center={REGION_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Dark Mode Map Base Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* 1. Heavy Truck Transport Routes */}
        {TRUCK_ROUTES.map((route) => (
          <Polyline
            key={route.id}
            positions={route.coordinates}
            pathOptions={{
              color: route.dustRiskScore > 75 ? '#EF4444' : '#00E5FF',
              weight: 4,
              opacity: 0.6,
              dashArray: '8, 8'
            }}
          >
            <Popup>
              <div className="text-xs p-1 space-y-1">
                <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Truck className="h-4.5 w-4.5 text-primary" /> {route.name}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                  <div>
                    <span className="text-muted-foreground">Daily Trucks:</span>{' '}
                    <span className="font-mono text-foreground font-bold">{route.heavyTruckCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg Speed:</span>{' '}
                    <span className="font-mono text-foreground font-bold">{route.averageSpeed} km/h</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Congestion:</span>{' '}
                    <span className="font-mono text-foreground font-bold">{route.congestion}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dust Risk:</span>{' '}
                    <span className="font-mono text-red-400 font-bold">{route.dustRiskScore}/100</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* 2. Active Simulating Truck Markers */}
        {Object.entries(truckPositions).map(([routeId, pos]) => {
          const route = TRUCK_ROUTES.find((r) => r.id === routeId);
          return (
            <CircleMarker
              key={`truck-${routeId}`}
              center={pos}
              radius={7}
              pathOptions={{
                fillColor: '#EAB308', // Amber color for haulers
                fillOpacity: 0.9,
                color: '#ffffff',
                weight: 1.5
              }}
            >
              <Popup>
                <div className="text-xs p-1.5 space-y-1">
                  <p className="font-bold text-yellow-400 flex items-center gap-1">
                    <Truck className="h-4 w-4" /> Active Hauling Unit
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Route: {route?.name}</p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                    <Wind className="h-3.5 w-3.5 text-primary animate-pulse" />
                    <span>Crosswind: <strong className="font-mono text-foreground">{windSpeed} km/h</strong></span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* 3. Industrial Zones (BSP, Siltara, Urla, Jamul) */}
        {INDUSTRIAL_ZONES.map((zone) => (
          <React.Fragment key={zone.id}>
            {/* Draw approximate impact buffer circle around the plant */}
            <CircleMarker
              center={zone.coordinates}
              radius={24}
              pathOptions={{
                fillColor: '#EF4444',
                fillOpacity: 0.08,
                stroke: false
              }}
            />
            <Marker
              position={zone.coordinates}
              icon={createZoneIcon(zone.pollutionIndex)}
            >
              <Popup>
                <div className="text-xs p-2 max-w-[220px] space-y-2">
                  <p className="font-bold text-foreground text-sm border-b border-white/5 pb-1 flex items-center gap-1">
                    <AlertCircle className="h-4.5 w-4.5 text-red-500" /> {zone.name}
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">{zone.description}</p>
                  <div className="flex justify-between items-center bg-red-950/40 p-2 rounded-lg border border-red-500/20 mt-1">
                    <span className="text-red-400 font-semibold">Corridor Pollution Index</span>
                    <span className="font-mono text-red-400 font-extrabold text-sm">{zone.pollutionIndex}/100</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {/* 4. Ambient AQI Stations */}
        {AQI_STATIONS.map((station) => (
          <Marker
            key={station.id}
            position={station.coordinates}
            icon={createStationIcon(station.aqi)}
            eventHandlers={{
              click: () => onSelectStation && onSelectStation(station.id),
            }}
          >
            <Popup>
              <div className="text-xs p-1.5 space-y-1.5">
                <p className="font-bold text-foreground text-sm">{station.name}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Ambient AQI:</span>
                    <span className="font-mono font-bold" style={{ color: getAQIColor(station.aqi) }}>{station.aqi}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">PM10 (Dust):</span>
                    <span className="font-mono text-foreground font-bold">{station.pm10} ug/m3</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">PM2.5 (Fine):</span>
                    <span className="font-mono text-foreground font-bold">{station.pm25} ug/m3</span>
                  </div>
                </div>
                {onSelectStation && (
                  <button
                    onClick={() => onSelectStation(station.id)}
                    className="w-full mt-2 bg-primary/20 text-primary border border-primary/20 rounded-md py-1 text-[10px] font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    Load Detailed Air Metrics
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Map Legend overlay */}
      <div className="absolute bottom-4 left-4 z-[400] glass-panel p-3.5 rounded-xl shadow-xl text-[10px] space-y-2 max-w-[170px] border border-white/10">
        <p className="font-bold text-foreground flex items-center gap-1">
          <Shield className="h-3.5 w-3.5 text-primary" /> Corridor Legend
        </p>
        <div className="space-y-1.5 pt-1.5 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-muted-foreground">AQI Good (0-100)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
            <span className="text-muted-foreground">AQI Moderate (101-200)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500"></span>
            <span className="text-muted-foreground">AQI Poor (201-300)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            <span className="text-muted-foreground">AQI Severe (301+)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-red-500/40 bg-red-500/10 flex items-center justify-center">
              <span className="h-1 w-1 bg-red-500 rounded-full"></span>
            </span>
            <span className="text-muted-foreground">Industrial Hotspot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 border-t-2 border-dashed border-primary"></span>
            <span className="text-muted-foreground">Coal/Aggregate Route</span>
          </div>
        </div>
      </div>

      {/* Floating Wind Vector overlay */}
      <div className="absolute top-4 right-4 z-[400] glass-panel p-2.5 rounded-xl shadow-xl flex items-center space-x-3 border border-white/10">
        <div className="flex flex-col text-[10px]">
          <span className="text-muted-foreground">Wind Vector</span>
          <span className="font-bold text-foreground font-mono">{windSpeed} km/h</span>
        </div>
        <div
          className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-transform duration-500 shadow-inner"
          style={{ transform: `rotate(${windDirection}deg)` }}
          title={`Wind blowing towards ${windDirection}°`}
        >
          <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      </div>
    </div>
  );
};
export default InteractiveMap;

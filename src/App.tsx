import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ui/Toast';
import AppLayout from './layout/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import AirQuality from './pages/AirQuality';
import Weather from './pages/Weather';
import Traffic from './pages/Traffic';
import MapPage from './pages/MapPage';
import Simulator from './pages/Simulator';
import Solutions from './pages/Solutions';
import CostCalculator from './pages/CostCalculator';
import Recommendations from './pages/Recommendations';
import Reports from './pages/Reports';

import { AlertItem } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'a1',
    title: 'Extreme PM10 Shearing Drift',
    message: 'Siltara sector-1 monitoring station reports PM10 at 310 µg/m³. Crosswind velocities exceed safety haulage limits.',
    timestamp: '16:15',
    severity: 'critical',
    location: 'Siltara Hub',
    read: false
  },
  {
    id: 'a2',
    title: 'Bhilai Sector-1 Crossing Congestion',
    message: 'Heavy vehicles queuing speed drops to 12 km/h. High idle drift risks flagged along NH-53 intersections.',
    timestamp: '15:40',
    severity: 'high',
    location: 'Bhilai Bypass',
    read: false
  },
  {
    id: 'a3',
    title: 'High Road Dryness Alert',
    message: 'Corridor humidity has fallen below 30%. Sprinkler scheduling must increase mist discharge by 25%.',
    timestamp: '14:20',
    severity: 'medium',
    location: 'NH-53 Corridor',
    read: false
  }
];

function App() {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  const clearAlerts = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout alerts={alerts} onMarkAllRead={clearAlerts} />}>
              <Route path="/" element={<Dashboard alerts={alerts} />} />
              <Route path="/aqi" element={<AirQuality />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/traffic" element={<Traffic />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/cost" element={<CostCalculator />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/reports" element={<Reports />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;

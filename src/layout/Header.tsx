import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell, Search, AlertCircle, Calendar } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { AlertItem } from '../types';

interface HeaderProps {
  alerts: AlertItem[];
  onMarkAllRead: () => void;
}

export const Header: React.FC<HeaderProps> = ({ alerts, onMarkAllRead }) => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDark, setIsDark] = useState(true);
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Theme toggle side effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  // Extract page title from route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard Overview';
      case '/aqi': return 'Corridor AQI Metrics';
      case '/weather': return 'Regional Meteorology';
      case '/traffic': return 'Haulage Traffic Analysis';
      case '/map': return 'GIS Corridor Map';
      case '/simulator': return 'Dust Leakage Simulator';
      case '/solutions': return 'Engineering Mitigations';
      case '/cost': return 'Economic Benefit Calculator';
      case '/recommendations': return 'AI Operations Panel';
      case '/reports': return 'Compliance & Export Reports';
      default: return 'DustShield Portal';
    }
  };

  const unreadAlerts = alerts.filter(a => !a.read);

  return (
    <header className="h-16 bg-[#0A0F1D]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-30 shrink-0 relative">
      {/* Title */}
      <div className="flex flex-col">
        <h1 className="text-base font-extrabold text-foreground tracking-tight m-0">{getPageTitle()}</h1>
        <div className="flex items-center space-x-1.5 text-[10px] text-muted-foreground mt-0.5 font-bold uppercase tracking-wider">
          <Calendar className="h-3 w-3 text-primary" />
          <span>Raipur-Bhilai Industrial Zone</span>
        </div>
      </div>

      {/* Center Geocode Geolocation Search */}
      <div className="hidden md:flex items-center w-72 relative">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search stations, corridors..."
          className="h-9 w-full rounded-full border border-white/10 bg-[#070B16] pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-5">
        {/* Date Time */}
        <div className="hidden lg:flex flex-col items-end text-right font-mono">
          <span className="text-[11px] font-bold text-foreground leading-none">
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-[9px] text-muted-foreground font-semibold uppercase mt-0.5 tracking-wider">
            {currentTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg bg-card/40 border border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all cursor-pointer"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications / Alerts Menu */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsMenu(!showAlertsMenu)}
            className="p-2 rounded-lg bg-card/40 border border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all cursor-pointer relative"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full bg-red-600 text-[10px] font-extrabold text-white flex items-center justify-center border-2 border-[#0A0F1D]">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showAlertsMenu && (
            <div className="absolute right-0 mt-3.5 w-80 glass-panel border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
              <div className="p-3.5 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-red-500" /> Active Hazards
                </span>
                {unreadAlerts.length > 0 && (
                  <button
                    onClick={() => {
                      onMarkAllRead();
                      setShowAlertsMenu(false);
                    }}
                    className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    Clear Warnings
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                {alerts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    No active warnings detected.
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className={`p-3 text-xs space-y-1 hover:bg-white/5 transition-colors ${!alert.read ? 'bg-red-500/5' : ''}`}>
                      <div className="flex justify-between items-start">
                        <span className={`font-bold uppercase tracking-wider text-[9px] ${
                          alert.severity === 'critical' ? 'text-red-500' : alert.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'
                        }`}>
                          {alert.severity} • {alert.location}
                        </span>
                        <span className="text-[9px] text-muted-foreground font-mono">{alert.timestamp}</span>
                      </div>
                      <p className="font-semibold text-foreground leading-snug">{alert.title}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{alert.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;

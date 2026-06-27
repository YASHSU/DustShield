import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Search, Bell, AlertCircle, User, ChevronDown, Moon, Sun } from 'lucide-react';
import { AlertItem } from '../types';
import MobileNav from './MobileNav';

interface HeaderProps {
  alerts: AlertItem[];
  onMarkAllRead: () => void;
}

interface NavGroup {
  label: string;
  items: { name: string; path: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Air Quality Data',
    items: [
      { name: 'Dashboard Overview', path: '/' },
      { name: 'Corridor AQI Metrics', path: '/aqi' },
      { name: 'GIS Corridor Map', path: '/map' },
    ],
  },
  {
    label: 'Environmental',
    items: [
      { name: 'Regional Meteorology', path: '/weather' },
      { name: 'Haulage Traffic Analysis', path: '/traffic' },
      { name: 'Dust Leakage Simulator', path: '/simulator' },
    ],
  },
  {
    label: 'Impact',
    items: [
      { name: 'Engineering Mitigations', path: '/solutions' },
      { name: 'Economic Benefit Calculator', path: '/cost' },
      { name: 'AI Operations Panel', path: '/recommendations' },
      { name: 'Compliance & Export Reports', path: '/reports' },
    ],
  },
];

export const Header: React.FC<HeaderProps> = ({ alerts, onMarkAllRead }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAlerts = alerts.filter((a) => !a.read);

  const isGroupActive = (group: NavGroup) =>
    group.items.some((item) => item.path === location.pathname);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#0A0F1D] border-b border-gray-100 dark:border-white/5 shrink-0">
      <div className="flex items-center justify-between h-16 px-6 lg:px-10 max-w-[1440px] mx-auto">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-8 w-8 bg-[#E02020] rounded-sm flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">DustShield</span>
        </NavLink>

        {/* Center Navigation */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-1">
          {NAV_GROUPS.map((group) => {
            const active = isGroupActive(group);
            const isOpen = openMenu === group.label;

            return (
              <div key={group.label} className="relative">
                <button
                  onClick={() => setOpenMenu(isOpen ? null : group.label)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    active || isOpen
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {group.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="nav-dropdown absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#111827] rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 py-2 overflow-hidden">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setOpenMenu(null)}
                        className={({ isActive }) =>
                          `block px-5 py-2.5 text-sm transition-colors ${
                            isActive
                              ? 'text-gray-900 dark:text-white font-semibold bg-gray-50 dark:bg-white/5'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                          }`
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Utilities */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer text-sm"
            title="Region"
          >
            <span className="text-base leading-none">🇮🇳</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowAlertsMenu(!showAlertsMenu)}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer relative"
            >
              <Bell className="h-5 w-5" />
              {unreadAlerts.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#E02020]" />
              )}
            </button>

            {showAlertsMenu && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden nav-dropdown">
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-[#E02020]" /> Active Hazards
                  </span>
                  {unreadAlerts.length > 0 && (
                    <button
                      onClick={() => {
                        onMarkAllRead();
                        setShowAlertsMenu(false);
                      }}
                      className="text-xs font-semibold text-[#E02020] hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
                  {alerts.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500">No active warnings detected.</div>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 text-sm space-y-1 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                          !alert.read ? 'bg-red-50 dark:bg-red-500/5' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`font-bold uppercase tracking-wider text-[10px] ${
                              alert.severity === 'critical'
                                ? 'text-red-600'
                                : alert.severity === 'high'
                                  ? 'text-orange-500'
                                  : 'text-yellow-600'
                            }`}
                          >
                            {alert.severity} • {alert.location}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">{alert.timestamp}</span>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white leading-snug">{alert.title}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{alert.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Account"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
      <MobileNav />
    </header>
  );
};

export default Header;

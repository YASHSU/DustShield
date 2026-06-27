import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { AlertItem } from '../types';

interface AppLayoutProps {
  alerts: AlertItem[];
  onMarkAllRead: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ alerts, onMarkAllRead }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#050914] text-foreground transition-colors duration-200">
      <Header alerts={alerts} onMarkAllRead={onMarkAllRead} />

      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {isDashboard ? (
          <Outlet />
        ) : (
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10">
            <Outlet />
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0A0F1D]/60 py-4 px-6 lg:px-10 shrink-0">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              Lat/Lng: <span className="text-gray-700 dark:text-foreground font-medium">21.2150° N, 81.4500° E</span>
            </span>
            <span className="hidden sm:inline text-gray-300 dark:text-white/10">|</span>
            <span>
              Status: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">CPCB Compliant</span>
            </span>
          </div>
          <div className="text-center sm:text-right">
            <span>DustShield © 2026. All rights reserved.</span>
            <span className="block mt-0.5 text-gray-400 dark:text-gray-500">
              Made by Suyash Chandrakar
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;

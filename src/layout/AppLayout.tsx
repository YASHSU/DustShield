import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { AlertItem } from '../types';

interface AppLayoutProps {
  alerts: AlertItem[];
  onMarkAllRead: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ alerts, onMarkAllRead }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Core Container */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* Top Header Controls */}
        <Header alerts={alerts} onMarkAllRead={onMarkAllRead} />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin bg-radial from-[#0c142c] to-[#050914] dark:bg-none">
          <div className="mx-auto max-w-7xl space-y-6">
            <Outlet />
          </div>
        </main>

        {/* compliance Footer */}
        <footer className="h-10 border-t border-white/5 bg-[#0A0F1D]/60 flex items-center justify-between px-8 text-[10px] text-muted-foreground shrink-0 select-none">
          <div className="flex items-center space-x-1 font-mono">
            <span>Lat/Lng:</span>
            <span className="text-foreground">21.2150° N, 81.4500° E</span>
            <span className="text-white/10">|</span>
            <span>Status:</span>
            <span className="text-emerald-400 font-bold">CPCB Compliant</span>
          </div>
          <div>
            <span>DustShield Environmental Intel Systems © 2026. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default AppLayout;

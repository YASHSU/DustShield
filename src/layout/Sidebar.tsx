import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wind,
  CloudSun,
  Car,
  Map,
  Sliders,
  Zap,
  Calculator,
  Sparkles,
  FileText,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Air Quality', path: '/aqi', icon: Wind },
    { name: 'Weather Forecast', path: '/weather', icon: CloudSun },
    { name: 'Traffic Metrics', path: '/traffic', icon: Car },
    { name: 'Interactive Map', path: '/map', icon: Map },
    { name: 'Dust Simulator', path: '/simulator', icon: Sliders },
    { name: 'Engineering Solutions', path: '/solutions', icon: Zap },
    { name: 'Cost Calculator', path: '/cost', icon: Calculator },
    { name: 'AI Recommendations', path: '/recommendations', icon: Sparkles },
    { name: 'Compliance Reports', path: '/reports', icon: FileText }
  ];

  return (
    <aside className={`w-64 bg-[#0A0F1D]/90 backdrop-blur-md border-r border-white/5 flex flex-col h-screen shrink-0 ${className}`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/5 space-x-3 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
          <ShieldCheck className="h-5 w-5 text-primary animate-pulse-slow" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-foreground tracking-tight text-sm leading-none">DUSTSHIELD</span>
          <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-widest mt-1">Chhattisgarh Core</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Status Footer */}
      <div className="p-4 border-t border-white/5 bg-black/10 text-[10px] space-y-2 shrink-0">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Active Nodes:</span>
          <span className="font-mono text-emerald-400 font-bold">5/5 Operational</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Corridor Status:</span>
          <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded font-bold">
            MODERATE RISK
          </span>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;

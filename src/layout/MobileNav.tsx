import React from 'react';
import { NavLink } from 'react-router-dom';

const MOBILE_LINKS = [
  { name: 'Dashboard', path: '/' },
  { name: 'Air Quality', path: '/aqi' },
  { name: 'Weather', path: '/weather' },
  { name: 'Traffic', path: '/traffic' },
  { name: 'Map', path: '/map' },
  { name: 'Simulator', path: '/simulator' },
  { name: 'Solutions', path: '/solutions' },
  { name: 'Reports', path: '/reports' },
];

export const MobileNav: React.FC = () => (
  <nav className="lg:hidden border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0A0F1D] overflow-x-auto">
    <div className="flex items-center gap-1 px-4 py-2 min-w-max">
      {MOBILE_LINKS.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default MobileNav;

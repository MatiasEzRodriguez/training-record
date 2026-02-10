import { useState } from 'react';
import { Home, Dumbbell, History, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', icon: Home, label: 'Inicio' },
  { path: '/routines', icon: Dumbbell, label: 'Rutinas' },
  { path: '/history', icon: History, label: 'Historial' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 pb-safe z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full
              ${isActive ? 'text-blue-500' : 'text-gray-400'}
              active:scale-95 transition-transform`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

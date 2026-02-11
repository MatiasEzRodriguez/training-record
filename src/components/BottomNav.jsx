import { Home, Dumbbell, History } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', icon: Home, label: 'Inicio' },
  { path: '/routines', icon: Dumbbell, label: 'Rutinas' },
  { path: '/history', icon: History, label: 'Historial' },
];

export function BottomNav() {
  return (
    <nav className="sticky top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-40">
      <div className="flex items-center justify-around h-12 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg
              ${isActive ? 'text-blue-500 bg-blue-500/10' : 'text-gray-400 hover:text-gray-200'}
              active:scale-95 transition-all`
            }
          >
            <item.icon className="w-4 h-4" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

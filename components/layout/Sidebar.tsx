
import React from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, VisualizeIcon, DevicesIcon, MaintenanceIcon, SupportIcon, DEXIcon } from '../ui/Icons';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Visualization', href: '/visualization', icon: VisualizeIcon },
  { name: 'Devices', href: '/devices', icon: DevicesIcon },
  { name: 'Maintenance', href: '/maintenance', icon: MaintenanceIcon },
  { name: 'Support', href: '/support', icon: SupportIcon },
  { name: 'DEX', href: '/dex', icon: DEXIcon },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-cyan-400">DSMS</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3 h-6 w-6" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

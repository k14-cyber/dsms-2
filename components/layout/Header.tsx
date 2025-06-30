
import React from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'System Dashboard',
  '/visualization': 'Network Topology Visualization',
  '/devices': 'Device Management',
  '/maintenance': 'Maintenance Schedule',
  '/support': 'Support & Ticketing',
  '/dex': 'Digital Experience (DEX) Overview',
};

const Header: React.FC = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'DSMS';

  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center px-6">
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
    </header>
  );
};

export default Header;

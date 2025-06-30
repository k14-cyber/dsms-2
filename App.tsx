
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import VisualizationPage from './components/pages/VisualizationPage';
import DeviceManagementPage from './components/pages/DeviceManagementPage';
import MaintenancePage from './components/pages/MaintenancePage';
import SupportPage from './components/pages/SupportPage';
import DEXPage from './components/pages/DEXPage';

// Note: You need to install required packages for this app to work:
// npm install react-router-dom recharts reactflow @google/genai lucide-react

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-900 text-slate-200">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/visualization" element={<VisualizationPage />} />
              <Route path="/devices" element={<DeviceManagementPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/dex" element={<DEXPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;

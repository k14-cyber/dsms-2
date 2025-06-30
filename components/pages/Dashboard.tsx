
import React from 'react';
import Card from '../ui/Card';
import { devices, supportTickets, cpuUsageData, networkLatencyData } from '../../services/mockData';
import { DeviceStatus, TicketStatus } from '../../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cpu, Wifi, AlertTriangle, LifeBuoy } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <Card className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-100">{value}</p>
        </div>
    </Card>
);

const Dashboard: React.FC = () => {
    const onlineDevices = devices.filter(d => d.status === DeviceStatus.Online).length;
    const warningDevices = devices.filter(d => d.status === DeviceStatus.Warning).length;
    const openTickets = supportTickets.filter(t => t.status === TicketStatus.Open || t.status === TicketStatus.InProgress).length;
    const avgLatency = Math.round(networkLatencyData.reduce((acc, cur) => acc + cur.value, 0) / networkLatencyData.length);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Online Devices" value={onlineDevices} icon={<Cpu size={24} className="text-white"/>} color="bg-green-500" />
                <StatCard title="Devices with Warnings" value={warningDevices} icon={<AlertTriangle size={24} className="text-white"/>} color="bg-amber-500" />
                <StatCard title="Open Support Tickets" value={openTickets} icon={<LifeBuoy size={24} className="text-white"/>} color="bg-blue-500" />
                <StatCard title="Avg. Network Latency" value={`${avgLatency}ms`} icon={<Wifi size={24} className="text-white"/>} color="bg-purple-500" />
            </div>

            <Card>
                <h3 className="text-lg font-semibold mb-4 text-slate-100">CPU Usage (%) - Last 24 Hours</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={cpuUsageData}>
                        <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="time" tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Legend />
                        <Area type="monotone" dataKey="value" name="CPU Usage" stroke="#22c55e" fillOpacity={1} fill="url(#colorCpu)" />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                 <h3 className="text-lg font-semibold mb-4 text-slate-100">Network Latency (ms) - Last 24 Hours</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={networkLatencyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="time" tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Legend />
                        <Bar dataKey="value" name="Latency" fill="#8b5cf6" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

        </div>
    );
};

export default Dashboard;


import React, { useState } from 'react';
import { maintenanceTasks as initialTasks, devices } from '../../services/mockData';
import { MaintenanceTask } from '../../types';
import Card from '../ui/Card';
import { generateMaintenancePlan } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const MaintenancePage: React.FC = () => {
    const [tasks, setTasks] = useState<MaintenanceTask[]>(initialTasks);
    const [aiPlan, setAiPlan] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleGeneratePlan = async () => {
        setIsLoading(true);
        setAiPlan('');
        const plan = await generateMaintenancePlan(devices);
        setAiPlan(plan);
        setIsLoading(false);
    };

    const getStatusBadge = (status: MaintenanceTask['status']) => {
        const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
        switch (status) {
            case 'Scheduled': return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'In Progress': return `${baseClasses} bg-amber-100 text-amber-800`;
            case 'Completed': return `${baseClasses} bg-green-100 text-green-800`;
            case 'Cancelled': return `${baseClasses} bg-slate-100 text-slate-800`;
            default: return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <h2 className="text-xl font-semibold text-slate-100 mb-4">Maintenance Schedule</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Task</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Device</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Scheduled At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-900 divide-y divide-slate-800">
                                {tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">{task.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{devices.find(d => d.id === task.deviceId)?.name || 'Unknown Device'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{new Date(task.scheduledAt).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={getStatusBadge(task.status)}>{task.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <div>
                <Card>
                    <h2 className="text-xl font-semibold text-slate-100 mb-4">AI Proactive Plan Generator</h2>
                    <p className="text-slate-400 text-sm mb-4">
                        Leverage AI to analyze device status and suggest a proactive maintenance plan.
                    </p>
                    <button 
                        onClick={handleGeneratePlan}
                        disabled={isLoading}
                        className="w-full flex justify-center items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white font-medium disabled:bg-slate-500"
                    >
                        {isLoading ? <Spinner className="w-5 h-5"/> : 'Generate New Plan'}
                    </button>
                    {aiPlan && (
                        <div className="mt-4 p-4 bg-slate-900 rounded-md border border-slate-700">
                            <h3 className="font-semibold text-cyan-400 mb-2">Generated Plan</h3>
                            <div className="text-sm text-slate-300 whitespace-pre-wrap">{aiPlan}</div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default MaintenancePage;

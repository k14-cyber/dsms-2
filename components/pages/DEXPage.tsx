import React, { useState } from 'react';
import Card from '../ui/Card';
import { dexMetrics, devices } from '../../services/mockData';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { generateDEXReport } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const DEXPage: React.FC = () => {
    const [report, setReport] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const overallScore = Math.round(dexMetrics.reduce((acc, metric) => acc + metric.score, 0) / dexMetrics.length);

    const handleGenerateReport = async () => {
        setIsLoading(true);
        setReport('');
        const result = await generateDEXReport(dexMetrics, devices);
        setReport(result);
        setIsLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <h3 className="text-lg font-semibold mb-4 text-slate-100">Digital Experience Score</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 flex flex-col items-center justify-center">
                            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold border-8 ${overallScore > 85 ? 'border-cyan-400 text-cyan-300' : overallScore > 70 ? 'border-amber-400 text-amber-300' : 'border-red-500 text-red-400'}`}>
                                {overallScore}
                            </div>
                            <p className="mt-2 text-slate-300 font-medium">Overall Score</p>
                        </div>
                        <div className="md:col-span-2">
                             <ResponsiveContainer width="100%" height={250}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dexMetrics}>
                                    <PolarGrid stroke="#475569" />
                                    <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                                    <Radar name="Score" dataKey="score" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.6} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold mb-4 text-slate-100">DEX Metrics Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <BarChart data={dexMetrics} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
                            <YAxis type="category" dataKey="name" width={120} stroke="#94a3b8" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                            <Legend />
                            <Bar dataKey="score" name="DEX Score" fill="#06b6d4" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card>
                    <h2 className="text-xl font-semibold text-slate-100 mb-4">AI Insight Engine</h2>
                    <p className="text-slate-400 text-sm mb-4">
                        Generate a detailed report with analysis and recommendations based on current DEX metrics and device health.
                    </p>
                    <button 
                        onClick={handleGenerateReport}
                        disabled={isLoading}
                        className="w-full flex justify-center items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white font-medium disabled:bg-slate-500"
                    >
                        {isLoading ? <Spinner className="w-5 h-5"/> : 'Generate Insight Report'}
                    </button>
                    {report && (
                        <div className="mt-4 p-4 bg-slate-900 rounded-md border border-slate-700 prose prose-invert prose-sm max-w-none text-slate-300">
                             {report.split('\n').map((line, i) => {
                                if (line.startsWith('###')) return <h3 key={i} className="text-cyan-400 !mt-4 !mb-2">{line.replace('### ', '')}</h3>
                                if (line.startsWith('**')) return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>
                                return <p key={i} className="!my-1">{line}</p>
                            })}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default DEXPage;
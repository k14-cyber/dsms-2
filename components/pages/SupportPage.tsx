import React, { useState } from 'react';
import { supportTickets as initialTickets } from '../../services/mockData';
import { SupportTicket, TicketStatus, TicketPriority } from '../../types';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import { getAISupportSuggestion } from '../../services/geminiService';
import Spinner from '../ui/Spinner';
import { MessageSquare } from 'lucide-react';

const AIAssistant: React.FC<{ ticket: SupportTicket }> = ({ ticket }) => {
    const [suggestion, setSuggestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGetSuggestion = async () => {
        setIsLoading(true);
        setSuggestion('');
        const result = await getAISupportSuggestion(ticket);
        setSuggestion(result);
        setIsLoading(false);
    };

    return (
        <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <h4 className="text-lg font-semibold text-slate-100 flex items-center">
                <MessageSquare className="mr-2 text-cyan-400" />
                AI Support Assistant
            </h4>
            <p className="text-sm text-slate-400 mt-1 mb-4">Get AI-powered troubleshooting steps for this ticket.</p>
            <button onClick={handleGetSuggestion} disabled={isLoading} className="w-full flex justify-center items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white font-medium disabled:bg-slate-500">
                {isLoading ? <Spinner /> : 'Get AI Suggestion'}
            </button>
            {suggestion && (
                <div className="mt-4 text-sm text-slate-300 whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                    {suggestion.split('\n').map((line, i) => {
                        if (line.startsWith('###')) return <h3 key={i} className="text-cyan-400 !mt-4 !mb-2">{line.replace('### ', '')}</h3>
                        if (line.startsWith('**')) return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>
                        return <p key={i} className="!my-1">{line}</p>
                    })}
                </div>
            )}
        </div>
    );
};


const SupportPage: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    const getStatusBadge = (status: TicketStatus) => {
        const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
        switch (status) {
            case TicketStatus.Open: return `${baseClasses} bg-blue-100 text-blue-800`;
            case TicketStatus.InProgress: return `${baseClasses} bg-amber-100 text-amber-800`;
            case TicketStatus.Resolved: return `${baseClasses} bg-green-100 text-green-800`;
            case TicketStatus.Closed: return `${baseClasses} bg-slate-100 text-slate-800`;
        }
    };
    
    const getPriorityBadge = (priority: TicketPriority) => {
        const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
        switch (priority) {
            case TicketPriority.Low: return `${baseClasses} bg-gray-100 text-gray-800`;
            case TicketPriority.Medium: return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case TicketPriority.High: return `${baseClasses} bg-orange-100 text-orange-800`;
            case TicketPriority.Critical: return `${baseClasses} bg-red-100 text-red-800`;
        }
    };

    return (
        <Card>
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Support Tickets</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Reporter</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Last Update</th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-900 divide-y divide-slate-800">
                        {tickets.map((ticket) => (
                            <tr key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="hover:bg-slate-800/50 cursor-pointer">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">{ticket.subject}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={getStatusBadge(ticket.status)}>{ticket.status}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={getPriorityBadge(ticket.priority)}>{ticket.priority}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{ticket.reporter}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{new Date(ticket.updatedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedTicket && (
                <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title="Ticket Details">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-100">{selectedTicket.subject}</h3>
                        <div className="flex space-x-4">
                            <span className={getStatusBadge(selectedTicket.status)}>{selectedTicket.status}</span>
                            <span className={getPriorityBadge(selectedTicket.priority)}>{selectedTicket.priority}</span>
                        </div>
                        <p className="text-slate-300 bg-slate-900/50 p-3 rounded-md">{selectedTicket.description}</p>
                        <div>
                            <p><strong className="text-slate-400">Reporter:</strong> {selectedTicket.reporter}</p>
                            <p><strong className="text-slate-400">Assignee:</strong> {selectedTicket.assignee || 'Unassigned'}</p>
                            <p><strong className="text-slate-400">Created:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                        </div>
                        <AIAssistant ticket={selectedTicket} />
                    </div>
                </Modal>
            )}
        </Card>
    );
};

export default SupportPage;
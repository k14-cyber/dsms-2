
import { Device, DeviceStatus, DeviceType, Connection, SupportTicket, TicketStatus, TicketPriority, MaintenanceTask, TimeDataPoint, DEXMetric } from '../types';
import { subHours, formatISO, subDays } from 'date-fns';

const generateMAC = () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
const randomIP = (i: number) => `10.1.1.${i+1}`;
const randomChoice = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const now = new Date();

export const devices: Device[] = [
  { id: 'd1', name: 'Core Router 1', ipAddress: randomIP(0), macAddress: generateMAC(), type: DeviceType.Router, status: DeviceStatus.Online, location: 'Data Center A', lastSeen: formatISO(now), os: 'Cisco IOS' },
  { id: 'd2', name: 'Core Switch 1', ipAddress: randomIP(1), macAddress: generateMAC(), type: DeviceType.Switch, status: DeviceStatus.Online, location: 'Data Center A', lastSeen: formatISO(now), os: 'Junos OS' },
  { id: 'd3', name: 'Web Server 1 (Prod)', ipAddress: randomIP(2), macAddress: generateMAC(), type: DeviceType.Server, status: DeviceStatus.Online, location: 'Data Center A', lastSeen: formatISO(now), os: 'Ubuntu 22.04 LTS' },
  { id: 'd4', name: 'Web Server 2 (Prod)', ipAddress: randomIP(3), macAddress: generateMAC(), type: DeviceType.Server, status: DeviceStatus.Warning, location: 'Data Center A', lastSeen: formatISO(now), os: 'Ubuntu 22.04 LTS' },
  { id: 'd5', name: 'DB Server 1 (Prod)', ipAddress: randomIP(4), macAddress: generateMAC(), type: DeviceType.Server, status: DeviceStatus.Online, location: 'Data Center A', lastSeen: formatISO(now), os: 'CentOS 9' },
  { id: 'd6', name: 'Firewall A', ipAddress: randomIP(5), macAddress: generateMAC(), type: DeviceType.Firewall, status: DeviceStatus.Online, location: 'Data Center A', lastSeen: formatISO(now), os: 'Palo Alto PAN-OS' },
  { id: 'd7', name: 'Dev Laptop - Alice', ipAddress: '192.168.1.10', macAddress: generateMAC(), type: DeviceType.Laptop, status: DeviceStatus.Offline, location: 'Office Wing B', lastSeen: formatISO(subHours(now, 5)), os: 'macOS Sonoma' },
  { id: 'd8', name: 'Marketing Desktop - Bob', ipAddress: '192.168.1.15', macAddress: generateMAC(), type: DeviceType.Desktop, status: DeviceStatus.Online, location: 'Office Wing C', lastSeen: formatISO(now), os: 'Windows 11' },
  { id: 'd9', name: 'Backup Server', ipAddress: randomIP(6), macAddress: generateMAC(), type: DeviceType.Server, status: DeviceStatus.Maintenance, location: 'Data Center B', lastSeen: formatISO(subHours(now, 2)), os: 'TrueNAS' },
];

export const connections: Connection[] = [
  { source: 'd1', target: 'd2' },
  { source: 'd1', target: 'd6' },
  { source: 'd2', target: 'd3' },
  { source: 'd2', target: 'd4' },
  { source: 'd2', target: 'd5' },
  { source: 'd5', target: 'd9' },
  { source: 'd8', target: 'd2' },
];

export const supportTickets: SupportTicket[] = [
  { id: 't1', subject: 'Cannot access internal wiki', description: 'When I try to access wiki.company.com, I get a 503 error. This has been happening since this morning.', reporter: 'Bob (Marketing)', assignee: 'Alice (IT)', status: TicketStatus.InProgress, priority: TicketPriority.High, createdAt: formatISO(subHours(now, 4)), updatedAt: formatISO(subHours(now, 1)) },
  { id: 't2', subject: 'Printer in Wing C not working', description: 'The color printer "CP-301" is showing an error code "E-005". Multiple people have reported this.', reporter: 'Carol (HR)', assignee: null, status: TicketStatus.Open, priority: TicketPriority.Medium, createdAt: formatISO(subHours(now, 2)), updatedAt: formatISO(subHours(now, 2)) },
  { id: 't3', subject: 'Request for new software license', description: 'I need a license for Adobe Photoshop for a new project. Project code is MKT-2024-Q3.', reporter: 'Dave (Marketing)', assignee: 'Alice (IT)', status: TicketStatus.Resolved, priority: TicketPriority.Low, createdAt: formatISO(subDays(now, 2)), updatedAt: formatISO(subDays(now, 1)) },
  { id: 't4', subject: 'Web Server 2 is slow', description: 'Our application monitoring shows high latency on Web Server 2. CPU usage is spiking to 95%.', reporter: 'System Alert', assignee: 'Eve (DevOps)', status: TicketStatus.InProgress, priority: TicketPriority.Critical, createdAt: formatISO(subHours(now, 1)), updatedAt: formatISO(subHours(now, 1)) },
];

export const maintenanceTasks: MaintenanceTask[] = [
    { id: 'm1', deviceId: 'd5', title: 'Apply kernel security patches', scheduledAt: formatISO(subDays(now, -3)), completedAt: null, status: 'Scheduled', notes: 'Critical CVE patch. Requires reboot.'},
    { id: 'm2', deviceId: 'd9', title: 'Monthly backup verification', scheduledAt: formatISO(now), completedAt: null, status: 'In Progress', notes: 'Verifying integrity of last month\'s full backup.'},
    { id: 'm3', deviceId: 'd1', title: 'Upgrade router firmware', scheduledAt: formatISO(subDays(now, 7)), completedAt: formatISO(subDays(now, 7)), status: 'Completed', notes: 'Firmware upgraded to v12.4. All tests passed.'},
];

export const generateTimeSeriesData = (points: number, max: number): TimeDataPoint[] => {
  return Array.from({ length: points }, (_, i) => ({
    time: formatISO(subHours(now, points - i)),
    value: Math.floor(Math.random() * max)
  }));
};

export const cpuUsageData = generateTimeSeriesData(24, 100);
export const networkLatencyData = generateTimeSeriesData(24, 200);

export const dexMetrics: DEXMetric[] = [
    { name: 'App Stability', score: 98, description: 'Percentage of user sessions that are crash-free.'},
    { name: 'Login Speed', score: 92, description: 'Average time for users to successfully log in.'},
    { name: 'Resource Usage', score: 78, description: 'Efficiency of device CPU/Memory usage during work hours.'},
    { name: 'Network Health', score: 85, description: 'Overall quality of network connections for end-users.'},
    { name: 'User Sentiment', score: 91, description: 'AI-driven analysis of support tickets and surveys.'},
];

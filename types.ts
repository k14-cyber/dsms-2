
export enum DeviceStatus {
  Online = 'Online',
  Offline = 'Offline',
  Warning = 'Warning',
  Maintenance = 'Maintenance',
}

export enum DeviceType {
  Server = 'Server',
  Router = 'Router',
  Switch = 'Switch',
  Laptop = 'Laptop',
  Desktop = 'Desktop',
  Firewall = 'Firewall'
}

export interface Device {
  id: string;
  name: string;
  ipAddress: string;
  macAddress: string;
  type: DeviceType;
  status: DeviceStatus;
  location: string;
  lastSeen: string;
  os: string;
}

export interface Connection {
  source: string;
  target: string;
}

export enum TicketStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export enum TicketPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  reporter: string;
  assignee: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTask {
  id: string;
  title: string;
  deviceId: string;
  scheduledAt: string;
  completedAt: string | null;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  notes: string;
}

export interface TimeDataPoint {
  time: string;
  value: number;
}

export interface DEXMetric {
  name: string;
  score: number;
  description: string;
}

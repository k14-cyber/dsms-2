import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Background,
  Controls,
  MiniMap,
  NodeProps
} from 'reactflow';
import 'reactflow/dist/style.css';
import { devices, connections } from '../../services/mockData';
import { Device, DeviceStatus, DeviceType } from '../../types';
import { ServerIcon, RouterIcon, SwitchIcon, FirewallIcon, LaptopIcon, DesktopIcon } from '../ui/Icons';
import Card from '../ui/Card';

const getStatusColor = (status: DeviceStatus) => {
  switch (status) {
    case DeviceStatus.Online: return 'border-green-500';
    case DeviceStatus.Offline: return 'border-slate-500';
    case DeviceStatus.Warning: return 'border-amber-400';
    case DeviceStatus.Maintenance: return 'border-blue-500';
    default: return 'border-slate-600';
  }
};

const getIconForType = (type: DeviceType) => {
    const props = { className: "w-8 h-8 text-slate-300" };
    switch (type) {
        case DeviceType.Server: return <ServerIcon {...props} />;
        case DeviceType.Router: return <RouterIcon {...props} />;
        case DeviceType.Switch: return <SwitchIcon {...props} />;
        case DeviceType.Firewall: return <FirewallIcon {...props} />;
        case DeviceType.Laptop: return <LaptopIcon {...props} />;
        case DeviceType.Desktop: return <DesktopIcon {...props} />;
        default: return <ServerIcon {...props} />;
    }
};

const DeviceNode: React.FC<NodeProps<Device>> = ({ data }) => {
  return (
    <div className={`p-3 bg-slate-800 rounded-lg border-2 ${getStatusColor(data.status)} shadow-lg w-48`}>
        <div className="flex items-center space-x-3">
            {getIconForType(data.type)}
            <div className="flex-1 overflow-hidden">
                <div className="font-bold text-sm text-slate-100 truncate">{data.name}</div>
                <div className="text-xs text-slate-400">{data.ipAddress}</div>
            </div>
        </div>
    </div>
  );
};

const nodeTypes = { device: DeviceNode };

const initialNodes: Node<Device>[] = devices.map((device, i) => ({
  id: device.id,
  type: 'device',
  data: device,
  position: { x: (i % 5) * 250, y: Math.floor(i / 5) * 200 },
}));

const initialEdges: Edge[] = connections.map((conn, i) => ({
  id: `e${i}-${conn.source}-${conn.target}`,
  source: conn.source,
  target: conn.target,
  animated: true,
  style: { stroke: '#64748b' },
}));

const VisualizationPage = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Device | null>(null);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data);
  };

  return (
    <div className="flex h-full gap-4">
        <div className="flex-grow h-full rounded-lg overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                className="bg-slate-900"
            >
                <Controls />
                <MiniMap nodeColor={n => getStatusColor(n.data.status).split('-')[1]} />
                <Background color="#475569" gap={16} />
            </ReactFlow>
        </div>
        <div className="w-96 flex-shrink-0">
             <Card className="h-full">
                <h2 className="text-xl font-semibold mb-4 text-slate-100">Device Details</h2>
                {selectedNode ? (
                    <div className="space-y-3 text-sm">
                        <p><strong className="text-slate-400 w-24 inline-block">Name:</strong> {selectedNode.name}</p>
                        <p><strong className="text-slate-400 w-24 inline-block">Status:</strong> 
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                selectedNode.status === 'Online' ? 'bg-green-500/20 text-green-400' :
                                selectedNode.status === 'Warning' ? 'bg-amber-500/20 text-amber-400' :
                                selectedNode.status === 'Offline' ? 'bg-slate-500/20 text-slate-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>{selectedNode.status}</span>
                        </p>
                        <p><strong className="text-slate-400 w-24 inline-block">IP Address:</strong> {selectedNode.ipAddress}</p>
                        <p><strong className="text-slate-400 w-24 inline-block">MAC Address:</strong> {selectedNode.macAddress}</p>
                        <p><strong className="text-slate-400 w-24 inline-block">Type:</strong> {selectedNode.type}</p>
                        <p><strong className="text-slate-400 w-24 inline-block">OS:</strong> {selectedNode.os}</p>
                        <p><strong className="text-slate-400 w-24 inline-block">Location:</strong> {selectedNode.location}</p>
                        <p><strong className="text-slate-400 w-24 inline-block">Last Seen:</strong> {new Date(selectedNode.lastSeen).toLocaleString()}</p>
                    </div>
                ) : (
                    <div className="text-slate-400 text-center mt-10">Select a node to see its details.</div>
                )}
             </Card>
        </div>
    </div>
  );
};

export default VisualizationPage;
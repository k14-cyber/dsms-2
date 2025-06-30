
import React, { useState } from 'react';
import { devices as initialDevices } from '../../services/mockData';
import { Device, DeviceStatus, DeviceType } from '../../types';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const DeviceForm: React.FC<{device: Partial<Device>, onSave: (device: Device) => void, onCancel: () => void}> = ({ device, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Device>>(device);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation
        if(formData.name && formData.ipAddress && formData.type && formData.status) {
            onSave(formData as Device);
        } else {
            alert('Please fill all required fields');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-300">Device Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300">IP Address</label>
                <input type="text" name="ipAddress" value={formData.ipAddress || ''} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-300">Device Type</label>
                <select name="type" value={formData.type || ''} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm">
                   {Object.values(DeviceType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-300">Status</label>
                <select name="status" value={formData.status || ''} onChange={handleChange} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm">
                   {Object.values(DeviceStatus).map(status => <option key={status} value={status}>{status}</option>)}
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md text-white font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white font-medium">Save Device</button>
            </div>
        </form>
    );
}

const DeviceManagementPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Partial<Device> | null>(null);

  const handleAddNew = () => {
    setEditingDevice({});
    setIsModalOpen(true);
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setIsModalOpen(true);
  };

  const handleDelete = (deviceId: string) => {
    if(window.confirm('Are you sure you want to delete this device?')){
        setDevices(devices.filter(d => d.id !== deviceId));
    }
  };

  const handleSave = (device: Device) => {
    if (device.id) {
      setDevices(devices.map(d => d.id === device.id ? device : d));
    } else {
      const newDevice = { ...device, id: `d${Date.now()}`, macAddress: '00:00:00:00:00:00', lastSeen: new Date().toISOString() };
      setDevices([...devices, newDevice]);
    }
    setIsModalOpen(false);
    setEditingDevice(null);
  };
  
  const getStatusBadge = (status: DeviceStatus) => {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (status) {
      case DeviceStatus.Online: return `${baseClasses} bg-green-100 text-green-800`;
      case DeviceStatus.Offline: return `${baseClasses} bg-slate-100 text-slate-800`;
      case DeviceStatus.Warning: return `${baseClasses} bg-amber-100 text-amber-800`;
      case DeviceStatus.Maintenance: return `${baseClasses} bg-blue-100 text-blue-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-100">Managed Devices</h2>
        <button onClick={handleAddNew} className="flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white font-medium">
            <Plus size={18} className="mr-2" /> Add New Device
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">IP Address</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-slate-900 divide-y divide-slate-800">
            {devices.map((device) => (
              <tr key={device.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">{device.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={getStatusBadge(device.status)}>{device.status}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{device.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{device.ipAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{device.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <button onClick={() => handleEdit(device)} className="text-cyan-400 hover:text-cyan-300 mr-4"><Edit size={18} /></button>
                   <button onClick={() => handleDelete(device.id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDevice?.id ? 'Edit Device' : 'Add New Device'}>
          {editingDevice && <DeviceForm device={editingDevice} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />}
       </Modal>
    </Card>
  );
};

export default DeviceManagementPage;

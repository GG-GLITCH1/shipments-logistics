import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Package,
  MapPin,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  picked_up: Package,
  in_transit: Truck,
  out_for_delivery: MapPin,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusFlow = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];

interface Shipment {
  id: string;
  trackingNumber: string;
  sender_name: string;
  receiver_name: string;
  origin: string;
  destination: string;
  status: string;
  created_at: string;
  estimated_delivery: string;
  weight?: number;
}

export default function ShipmentManagement() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // Fetch shipments on mount
  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/shipments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setShipments(data.shipments || []);
      }
    } catch (error) {
      console.error('Error fetching shipments:', error);
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.sender_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.receiver_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || shipment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatus = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    // Set next status in flow as default
    const currentIndex = statusFlow.indexOf(shipment.status);
    const nextStatus = statusFlow[currentIndex + 1] || shipment.status;
    setNewStatus(nextStatus);
    setLocation('');
    setDescription('');
    setIsUpdateDialogOpen(true);
  };

  const submitStatusUpdate = async () => {
    if (!selectedShipment || !newStatus) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/shipments/${selectedShipment.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          location: location || 'Unknown',
          description: description || `Status updated to ${getStatusLabel(newStatus)}`,
        }),
      });

      if (response.ok) {
        await fetchShipments();
        setIsUpdateDialogOpen(false);
        setSelectedShipment(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteShipment = async (shipmentId: string) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/shipments/${shipmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      await fetchShipments();
    } catch (error) {
      console.error('Error deleting shipment:', error);
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    return statusFlow[currentIndex + 1];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950">Shipment Management</h1>
          <p className="text-gray-500 mt-1">Track and manage all shipments on your platform</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-brand text-white hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Create Shipment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Shipment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sender Name</label>
                  <Input placeholder="Enter sender name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Receiver Name</label>
                  <Input placeholder="Enter receiver name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Origin</label>
                  <Input placeholder="City, State" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination</label>
                  <Input placeholder="City, State" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Weight (kg)</label>
                <Input type="number" placeholder="Enter weight" />
              </div>
              <Button 
                className="w-full bg-gradient-brand text-white"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Create Shipment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total', count: shipments.length, color: 'bg-gray-500' },
          { label: 'Pending', count: shipments.filter(s => s.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Picked Up', count: shipments.filter(s => s.status === 'picked_up').length, color: 'bg-blue-500' },
          { label: 'In Transit', count: shipments.filter(s => s.status === 'in_transit').length, color: 'bg-purple-500' },
          { label: 'Out for Delivery', count: shipments.filter(s => s.status === 'out_for_delivery').length, color: 'bg-orange-500' },
          { label: 'Delivered', count: shipments.filter(s => s.status === 'delivered').length, color: 'bg-green-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-navy-950 mt-1">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by tracking number, sender, or receiver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 px-4 rounded-md border border-gray-200 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button variant="outline" className="gap-2" onClick={fetchShipments}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tracking #</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sender / Receiver</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Route</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Est. Delivery</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredShipments.map((shipment) => {
                const StatusIcon = statusIcons[shipment.status] || Package;
                const nextStatus = getNextStatus(shipment.status);
                
                return (
                  <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-navy-950">{shipment.trackingNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-navy-950">{shipment.sender_name}</p>
                        <p className="text-sm text-gray-500">{shipment.receiver_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span>{shipment.origin}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span>{shipment.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)} bg-opacity-10`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {getStatusLabel(shipment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {shipment.estimated_delivery ? formatDate(shipment.estimated_delivery) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2" onClick={() => handleViewShipment(shipment)}>
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          {nextStatus && (
                            <DropdownMenuItem className="gap-2" onClick={() => handleUpdateStatus(shipment)}>
                              <RefreshCw className="w-4 h-4" />
                              Update to {getStatusLabel(nextStatus)}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="gap-2">
                            <Edit className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-red-600"
                            onClick={() => handleDeleteShipment(shipment.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredShipments.length} of {shipments.length} shipments
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* View Shipment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Shipment Details</DialogTitle>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Tracking Number</label>
                  <p className="font-medium">{selectedShipment.trackingNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p className="font-medium">{getStatusLabel(selectedShipment.status)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Sender</label>
                <p className="font-medium">{selectedShipment.sender_name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Receiver</label>
                <p className="font-medium">{selectedShipment.receiver_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Origin</label>
                  <p className="font-medium">{selectedShipment.origin}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Destination</label>
                  <p className="font-medium">{selectedShipment.destination}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Estimated Delivery</label>
                <p className="font-medium">
                  {selectedShipment.estimated_delivery ? formatDate(selectedShipment.estimated_delivery) : 'N/A'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Shipment Status</DialogTitle>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Current Status</label>
                <p className="text-gray-600">{getStatusLabel(selectedShipment.status)}</p>
              </div>
              <div>
                <label className="text-sm font-medium">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 mt-1"
                >
                  <option value="pending">Pending</option>
                  <option value="picked_up">Picked Up</option>
                  <option value="in_transit">In Transit</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York Distribution Center"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Package scanned at facility"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-gradient-brand text-white"
                  onClick={submitStatusUpdate}
                  disabled={isLoading || !newStatus}
                >
                  {isLoading ? 'Updating...' : 'Update Status'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsUpdateDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

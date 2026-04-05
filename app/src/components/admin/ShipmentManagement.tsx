import { useState } from 'react';
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
  Filter,
  Download,
  Package,
  MapPin,
  CheckCircle,
  Truck,
  Clock,
  XCircle
} from 'lucide-react';
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils';

// Mock shipments data
const mockShipments = [
  { 
    id: '1', 
    trackingNumber: 'CSS123456789', 
    sender: 'ABC Electronics', 
    receiver: 'John Doe',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    status: 'in_transit',
    createdAt: '2024-12-18',
    estimatedDelivery: '2024-12-20',
  },
  { 
    id: '2', 
    trackingNumber: 'CSS987654321', 
    sender: 'Tech Corp', 
    receiver: 'Sarah Smith',
    origin: 'San Francisco, CA',
    destination: 'Seattle, WA',
    status: 'delivered',
    createdAt: '2024-12-15',
    estimatedDelivery: '2024-12-17',
  },
  { 
    id: '3', 
    trackingNumber: 'CSS456789123', 
    sender: 'Global Trade', 
    receiver: 'Mike Johnson',
    origin: 'Miami, FL',
    destination: 'Chicago, IL',
    status: 'pending',
    createdAt: '2024-12-19',
    estimatedDelivery: '2024-12-22',
  },
  { 
    id: '4', 
    trackingNumber: 'CSS789123456', 
    sender: 'Fast Delivery', 
    receiver: 'Emily Brown',
    origin: 'Boston, MA',
    destination: 'Denver, CO',
    status: 'out_for_delivery',
    createdAt: '2024-12-17',
    estimatedDelivery: '2024-12-19',
  },
  { 
    id: '5', 
    trackingNumber: 'CSS321654987', 
    sender: 'Express Ship', 
    receiver: 'David Wilson',
    origin: 'Dallas, TX',
    destination: 'Phoenix, AZ',
    status: 'picked_up',
    createdAt: '2024-12-19',
    estimatedDelivery: '2024-12-21',
  },
  { 
    id: '6', 
    trackingNumber: 'CSS654987321', 
    sender: 'Prime Logistics', 
    receiver: 'Lisa Anderson',
    origin: 'Atlanta, GA',
    destination: 'Portland, OR',
    status: 'cancelled',
    createdAt: '2024-12-16',
    estimatedDelivery: '2024-12-18',
  },
];

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  picked_up: Package,
  in_transit: Truck,
  out_for_delivery: MapPin,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function ShipmentManagement() {
  const [shipments, setShipments] = useState(mockShipments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.receiver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || shipment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteShipment = (shipmentId: string) => {
    setShipments(shipments.filter(shipment => shipment.id !== shipmentId));
  };

  const handleUpdateStatus = (shipmentId: string, newStatus: string) => {
    setShipments(shipments.map(shipment => {
      if (shipment.id === shipmentId) {
        return { ...shipment, status: newStatus };
      }
      return shipment;
    }));
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
          { label: 'In Transit', count: shipments.filter(s => s.status === 'in_transit').length, color: 'bg-purple-500' },
          { label: 'Out for Delivery', count: shipments.filter(s => s.status === 'out_for_delivery').length, color: 'bg-blue-500' },
          { label: 'Delivered', count: shipments.filter(s => s.status === 'delivered').length, color: 'bg-green-500' },
          { label: 'Cancelled', count: shipments.filter(s => s.status === 'cancelled').length, color: 'bg-red-500' },
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
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
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
                const StatusIcon = statusIcons[shipment.status];
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
                        <p className="font-medium text-navy-950">{shipment.sender}</p>
                        <p className="text-sm text-gray-500">{shipment.receiver}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span>{shipment.origin}</span>
                        <span className="text-gray-400">→</span>
                        <span>{shipment.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status).replace('bg-', 'bg-opacity-10 bg-')} text-${getStatusColor(shipment.status).replace('bg-', '')}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {getStatusLabel(shipment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(shipment.estimatedDelivery)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => handleUpdateStatus(shipment.id, 'delivered')}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark as Delivered
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
    </div>
  );
}

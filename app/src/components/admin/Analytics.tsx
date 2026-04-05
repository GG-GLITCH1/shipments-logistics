import { useState } from 'react';
import { 
  Users, 
  Package, 
  DollarSign,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock chart data
const monthlyData = [
  { month: 'Jan', shipments: 420, revenue: 12500 },
  { month: 'Feb', shipments: 380, revenue: 11200 },
  { month: 'Mar', shipments: 510, revenue: 15800 },
  { month: 'Apr', shipments: 590, revenue: 18200 },
  { month: 'May', shipments: 650, revenue: 20100 },
  { month: 'Jun', shipments: 720, revenue: 22400 },
  { month: 'Jul', shipments: 780, revenue: 24500 },
  { month: 'Aug', shipments: 840, revenue: 26800 },
  { month: 'Sep', shipments: 920, revenue: 29100 },
  { month: 'Oct', shipments: 980, revenue: 31500 },
  { month: 'Nov', shipments: 1050, revenue: 33800 },
  { month: 'Dec', shipments: 1120, revenue: 36200 },
];

const topRoutes = [
  { from: 'New York, NY', to: 'Los Angeles, CA', count: 245, revenue: 48500 },
  { from: 'San Francisco, CA', to: 'Seattle, WA', count: 189, revenue: 32400 },
  { from: 'Miami, FL', to: 'Chicago, IL', count: 167, revenue: 28900 },
  { from: 'Boston, MA', to: 'Denver, CO', count: 134, revenue: 23100 },
  { from: 'Dallas, TX', to: 'Phoenix, AZ', count: 112, revenue: 19800 },
];

const deliveryPerformance = [
  { label: 'On Time', value: 94.2, color: 'bg-green-500' },
  { label: 'Late', value: 4.1, color: 'bg-yellow-500' },
  { label: 'Failed', value: 1.7, color: 'bg-red-500' },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('last-30-days');

  const maxShipments = Math.max(...monthlyData.map(d => d.shipments));
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your platform performance and key metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-10 px-4 rounded-md border border-gray-200 text-sm"
          >
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
            <option value="last-year">Last Year</option>
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

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            name: 'Total Shipments', 
            value: '8,847', 
            change: '+15.3%', 
            trend: 'up',
            icon: Package,
            color: 'from-purple-500 to-purple-600'
          },
          { 
            name: 'Active Users', 
            value: '2,847', 
            change: '+8.7%', 
            trend: 'up',
            icon: Users,
            color: 'from-teal-500 to-teal-600'
          },
          { 
            name: 'Revenue', 
            value: '$284,500', 
            change: '+22.4%', 
            trend: 'up',
            icon: DollarSign,
            color: 'from-green-500 to-green-600'
          },
          { 
            name: 'Avg. Delivery Time', 
            value: '24.5h', 
            change: '-5.2%', 
            trend: 'up',
            icon: Clock,
            color: 'from-blue-500 to-blue-600'
          },
        ].map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-navy-950 mt-1">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Shipments Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-navy-950">Monthly Shipments</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Package className="w-4 h-4" />
              <span>Total: 8,847</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-purple-200 rounded-t-lg hover:bg-purple-300 transition-colors relative group"
                  style={{ height: `${(data.shipments / maxShipments) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy-950 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {data.shipments} shipments
                  </div>
                </div>
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-navy-950">Monthly Revenue</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <DollarSign className="w-4 h-4" />
              <span>Total: $284,500</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-teal-200 rounded-t-lg hover:bg-teal-300 transition-colors relative group"
                  style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy-950 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${data.revenue.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Routes */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-display font-semibold text-navy-950 mb-6">Top Routes</h3>
          <div className="space-y-4">
            {topRoutes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-navy-950 text-sm">
                      {route.from} → {route.to}
                    </p>
                    <p className="text-xs text-gray-500">{route.count} shipments</p>
                  </div>
                </div>
                <p className="font-semibold text-green-600">
                  ${route.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Performance */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-display font-semibold text-navy-950 mb-6">Delivery Performance</h3>
          
          <div className="space-y-6">
            {deliveryPerformance.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-semibold text-navy-950">{item.value}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-navy-950">94.2%</p>
                <p className="text-xs text-gray-500">On-Time Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">4.8</p>
                <p className="text-xs text-gray-500">Customer Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">99.1%</p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

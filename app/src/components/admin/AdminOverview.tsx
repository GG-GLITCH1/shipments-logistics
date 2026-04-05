import { useEffect, useState } from 'react';
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  CheckCircle,
  Truck
} from 'lucide-react';
import { useCountUp } from '@/hooks/useScrollAnimation';

const stats = [
  { 
    name: 'Total Users', 
    value: 2847, 
    change: '+12.5%', 
    trend: 'up',
    icon: Users,
    color: 'from-purple-500 to-purple-600'
  },
  { 
    name: 'Active Shipments', 
    value: 156, 
    change: '+8.2%', 
    trend: 'up',
    icon: Package,
    color: 'from-teal-500 to-teal-600'
  },
  { 
    name: 'Revenue', 
    value: 45231, 
    change: '+23.1%', 
    trend: 'up',
    icon: DollarSign,
    color: 'from-green-500 to-green-600',
    prefix: '$'
  },
  { 
    name: 'Delivery Rate', 
    value: 98.5, 
    change: '+2.3%', 
    trend: 'up',
    icon: TrendingUp,
    color: 'from-blue-500 to-blue-600',
    suffix: '%'
  },
];

const recentActivity = [
  { id: 1, type: 'shipment', message: 'New shipment created #CSS789456', time: '2 minutes ago', icon: Package },
  { id: 2, type: 'user', message: 'New user registered: john@example.com', time: '5 minutes ago', icon: Users },
  { id: 3, type: 'delivery', message: 'Package #CSS123456 delivered', time: '12 minutes ago', icon: CheckCircle },
  { id: 4, type: 'shipment', message: 'Shipment #CSS456789 in transit', time: '18 minutes ago', icon: Truck },
  { id: 5, type: 'user', message: 'User updated profile: sarah@example.com', time: '25 minutes ago', icon: Users },
];

const shipmentStatus = [
  { status: 'Delivered', count: 1847, percentage: 65, color: 'bg-green-500' },
  { status: 'In Transit', count: 523, percentage: 18, color: 'bg-purple-500' },
  { status: 'Pending', count: 312, percentage: 11, color: 'bg-yellow-500' },
  { status: 'Out for Delivery', count: 165, percentage: 6, color: 'bg-blue-500' },
];

export default function AdminOverview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-950">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.name} stat={stat} index={index} mounted={mounted} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Shipment Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-navy-950">Shipment Status</h3>
            <button className="text-sm text-purple-600 hover:underline">View All</button>
          </div>
          
          <div className="space-y-6">
            {shipmentStatus.map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.status}</span>
                  <span className="text-sm text-gray-500">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: mounted ? `${item.percentage}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-navy-950">2,847</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">98.5%</p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">24h</p>
                <p className="text-xs text-gray-500">Avg. Delivery</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">4.8</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-navy-950">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <activity.icon className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-navy-950 truncate">{activity.message}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 text-sm text-purple-600 font-medium border-2 border-purple-100 rounded-xl hover:bg-purple-50 transition-colors">
            View All Activity
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Create Shipment', icon: Package, color: 'bg-purple-600' },
          { name: 'Add User', icon: Users, color: 'bg-teal-600' },
          { name: 'Generate Report', icon: TrendingUp, color: 'bg-blue-600' },
          { name: 'View Analytics', icon: Activity, color: 'bg-green-600' },
        ].map((action) => (
          <button
            key={action.name}
            className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-navy-950">{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StatCard({ 
  stat, 
  index, 
  mounted 
}: { 
  stat: typeof stats[0]; 
  index: number; 
  mounted: boolean;
}) {
  const { count, startAnimation } = useCountUp(stat.value, 2000);
  const Icon = stat.icon;

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => startAnimation(), index * 100);
      return () => clearTimeout(timer);
    }
  }, [mounted, index, startAnimation]);

  const formatValue = (val: number) => {
    if (stat.prefix) {
      return stat.prefix + val.toLocaleString();
    }
    if (stat.suffix) {
      return val.toFixed(1) + stat.suffix;
    }
    return val.toLocaleString();
  };

  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{stat.name}</p>
          <p className="text-2xl font-bold text-navy-950 mt-1">
            {formatValue(count)}
          </p>
          <div className={`flex items-center gap-1 mt-2 text-sm ${
            stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {stat.trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{stat.change}</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  Box,
  ArrowLeft,
  Calendar,
  User,
  Weight,
  Ruler
} from 'lucide-react';
import { getStatusColor, getStatusLabel, formatDateTime } from '@/lib/utils';

// Mock tracking data
const mockTrackingData = {
  trackingNumber: 'CSS123456789',
  status: 'in_transit',
  sender: {
    name: 'ABC Electronics',
    address: '123 Business Ave, New York, NY 10001',
  },
  receiver: {
    name: 'John Doe',
    address: '456 Residential St, Los Angeles, CA 90001',
  },
  package: {
    weight: 2.5,
    dimensions: { length: 30, width: 20, height: 15 },
    service: 'Express Delivery',
  },
  estimatedDelivery: '2024-12-20T14:00:00',
  createdAt: '2024-12-18T09:30:00',
  history: [
    {
      id: '1',
      status: 'picked_up',
      location: 'New York, NY',
      timestamp: '2024-12-18T09:30:00',
      description: 'Package picked up from sender',
    },
    {
      id: '2',
      status: 'in_transit',
      location: 'New York Distribution Center',
      timestamp: '2024-12-18T14:20:00',
      description: 'Package arrived at distribution center',
    },
    {
      id: '3',
      status: 'in_transit',
      location: 'In Transit',
      timestamp: '2024-12-18T18:00:00',
      description: 'Package departed from New York',
    },
    {
      id: '4',
      status: 'in_transit',
      location: 'Chicago, IL Hub',
      timestamp: '2024-12-19T06:30:00',
      description: 'Package arrived at Chicago hub',
    },
    {
      id: '5',
      status: 'in_transit',
      location: 'In Transit',
      timestamp: '2024-12-19T08:00:00',
      description: 'Package departed from Chicago',
    },
  ],
};

export default function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('number') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [trackingData, setTrackingData] = useState<typeof mockTrackingData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const number = searchParams.get('number');
    if (number) {
      setTrackingNumber(number);
      handleTrack(number);
    }
  }, []);

  const handleTrack = async (number: string = trackingNumber) => {
    if (!number.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsSearching(true);
    setError('');
    setTrackingData(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo, accept any tracking number starting with CSS
    if (number.toUpperCase().startsWith('CSS')) {
      setTrackingData({
        ...mockTrackingData,
        trackingNumber: number.toUpperCase(),
      });
      setSearchParams({ number: number.toUpperCase() });
    } else {
      setError('Tracking number not found. Try "CSS123456789" for demo.');
    }

    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-navy-950">
                CashSupport<span className="text-purple-600">Shipment</span>
              </span>
            </Link>
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-navy-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="font-display text-3xl font-bold text-navy-950 text-center mb-2">
            Track Your Shipment
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Enter your tracking number below to get real-time updates on your package location and delivery status.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter tracking number (e.g., CSS123456789)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl"
              />
            </div>
            <Button 
              type="submit"
              size="lg"
              disabled={isSearching}
              className="h-14 px-8 bg-gradient-brand text-white hover:opacity-90 shadow-lg hover:shadow-glow transition-all duration-300"
            >
              {isSearching ? 'Tracking...' : 'Track'}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-8 animate-fade-in">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                  <p className="text-2xl font-display font-bold text-navy-950">
                    {trackingData.trackingNumber}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(trackingData.status)} animate-pulse`} />
                  <span className="text-lg font-semibold text-navy-950">
                    {getStatusLabel(trackingData.status)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="flex justify-between mb-2">
                  {['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'].map((step, index) => {
                    const stepStatuses = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
                    const currentIndex = stepStatuses.indexOf(trackingData.status);
                    const isActive = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          isActive 
                            ? isCurrent 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isActive && index < currentIndex ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <span className={`text-xs ${isActive ? 'text-navy-950' : 'text-gray-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-brand transition-all duration-500"
                    style={{ 
                      width: `${((['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'].indexOf(trackingData.status) + 1) / 5) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Package Details */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-display font-semibold text-navy-950 mb-4 flex items-center gap-2">
                    <Box className="w-5 h-5 text-purple-600" />
                    Package Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Weight className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{trackingData.package.weight} kg</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Ruler className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {trackingData.package.dimensions.length} x {trackingData.package.dimensions.width} x {trackingData.package.dimensions.height} cm
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{trackingData.package.service}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-display font-semibold text-navy-950 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Sender & Receiver
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-medium text-navy-950">{trackingData.sender.name}</p>
                      <p className="text-sm text-gray-600">{trackingData.sender.address}</p>
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-medium text-navy-950">{trackingData.receiver.name}</p>
                      <p className="text-sm text-gray-600">{trackingData.receiver.address}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-brand rounded-2xl p-6 text-white">
                  <h3 className="font-display font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Estimated Delivery
                  </h3>
                  <p className="text-2xl font-bold">
                    {formatDateTime(trackingData.estimatedDelivery)}
                  </p>
                </div>
              </div>

              {/* Tracking History */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                  <h3 className="font-display font-semibold text-navy-950 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Tracking History
                  </h3>

                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

                    {/* Timeline Events */}
                    <div className="space-y-8">
                      {[...trackingData.history].reverse().map((event, index) => (
                        <div key={event.id} className="relative flex gap-6">
                          {/* Timeline Dot */}
                          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-purple-600' : 'bg-gray-200'
                          }`}>
                            <MapPin className={`w-4 h-4 ${index === 0 ? 'text-white' : 'text-gray-500'}`} />
                          </div>

                          {/* Event Content */}
                          <div className="flex-1 pb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <p className="font-semibold text-navy-950">
                                  {getStatusLabel(event.status)}
                                </p>
                                <p className="text-gray-600">{event.description}</p>
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDateTime(event.timestamp)}
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        {!trackingData && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-navy-950 text-center mb-8">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  title: 'Enter Tracking Number',
                  description: 'Input your unique tracking number provided at the time of shipping.',
                },
                {
                  icon: MapPin,
                  title: 'View Live Location',
                  description: 'See your package location on an interactive map with real-time updates.',
                },
                {
                  icon: CheckCircle,
                  title: 'Track Progress',
                  description: 'Monitor delivery progress and view detailed history of your shipment.',
                },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-display font-semibold text-navy-950 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Users, Package, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCountUp, useScrollAnimation } from '@/hooks/useScrollAnimation';

const stats = [
  { label: 'Active Businesses', value: 500, suffix: '+', icon: Users },
  { label: 'Packages Tracked', value: 2000000, suffix: '+', icon: Package },
  { label: 'Uptime Guarantee', value: 99.9, suffix: '%', icon: Shield },
  { label: 'Support Available', value: 24, suffix: '/7', icon: Clock },
];

export default function Hero() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const navigate = useNavigate();
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation<HTMLDivElement>();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/track?number=${encodeURIComponent(trackingNumber)}`);
    }
  };

  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-teal-200/30 to-transparent rounded-full blur-3xl" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #7f56d9 1px, transparent 1px),
                           linear-gradient(to bottom, #7f56d9 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full">
              <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-purple-700">
                Multi-Tenant Logistics Platform
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-950 leading-tight">
                Empower Your{' '}
                <span className="text-gradient">Delivery</span>
                <br />
                Business
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                The ultimate multi-tenant platform for seamless shipment tracking, 
                logistics management, and P2P point systems. Scale your fleet with confidence.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link to="/sign-up">
                <Button 
                  size="lg" 
                  className="bg-gradient-brand text-white hover:opacity-90 shadow-lg hover:shadow-glow transition-all duration-300 group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/track">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
                >
                  <Play className="mr-2 w-4 h-4" />
                  Track Package
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Trusted by <span className="font-semibold text-navy-950">500+</span> logistics experts
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-teal-500/20 rounded-3xl blur-2xl" />
            
            {/* Dashboard Image */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden animate-float">
              <img
                src="/hero-dashboard.jpg"
                alt="CashSupportShipment Dashboard"
                className="w-full h-auto"
              />
              
              {/* Floating Stats Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Delivered</p>
                    <p className="text-2xl font-bold text-navy-950">2,847</p>
                  </div>
                  <div className="h-10 w-px bg-gray-200" />
                  <div>
                    <p className="text-xs text-gray-500">In Transit</p>
                    <p className="text-2xl font-bold text-purple-600">156</p>
                  </div>
                  <div className="h-10 w-px bg-gray-200" />
                  <div className="flex items-center gap-2 text-green-500">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-medium">+24%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h3 className="text-xl font-display font-semibold text-navy-950 mb-2">
              Where is your package?
            </h3>
            <p className="text-gray-500 mb-6">
              Enter your tracking number to see real-time updates for your shipment across our entire partner network.
            </p>
            
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                className="h-14 px-8 bg-gradient-brand text-white hover:opacity-90 shadow-lg hover:shadow-glow transition-all duration-300"
              >
                Track Now
              </Button>
            </form>
            
            <p className="mt-4 text-sm text-gray-500 text-center">
              Or go to our{' '}
              <Link to="/track" className="text-purple-600 hover:underline font-medium">
                full tracking page
              </Link>{' '}
              for more options
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div 
          ref={statsRef}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <StatCard 
              key={stat.label} 
              stat={stat} 
              index={index} 
              isVisible={statsVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ 
  stat, 
  index, 
  isVisible 
}: { 
  stat: typeof stats[0]; 
  index: number; 
  isVisible: boolean;
}) {
  const { count, startAnimation } = useCountUp(stat.value, 2000);
  const Icon = stat.icon;

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => startAnimation(), index * 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, index, startAnimation]);

  const formatValue = (val: number) => {
    if (stat.value >= 1000000) {
      return (val / 1000000).toFixed(0) + 'M';
    }
    if (stat.value >= 1000) {
      return (val / 1000).toFixed(0) + 'K';
    }
    if (stat.value < 100 && stat.value % 1 !== 0) {
      return val.toFixed(1);
    }
    return val.toString();
  };

  return (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        isVisible ? 'animate-slide-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-bold text-navy-950">
            {formatValue(count)}{stat.suffix}
          </p>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      </div>
    </div>
  );
}

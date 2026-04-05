import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { 
  MapPin, 
  Users, 
  Palette, 
  Lock, 
  BarChart3, 
  Headphones,
  ArrowUpRight
} from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Real-time Tracking',
    description: 'GPS-enabled fleet monitoring with live status updates for every shipment and precise arrival estimates.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Users,
    title: 'P2P Point System',
    description: 'Optimized peer-to-peer logistics network to maximize efficiency through localized collection points.',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
  },
  {
    icon: Palette,
    title: 'Custom Branding',
    description: 'Fully branded status updates and milestones. Keep your brand front and center throughout the journey.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'Integrated payment processing with multiple gateways including crypto for seamless transactions.',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Comprehensive dashboards with actionable insights to optimize routes and reduce delivery times.',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated support team available around the clock to help you succeed with personalized assistance.',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50',
  },
];

export default function Features() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-50/50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={ref} className="text-center max-w-3xl mx-auto mb-16">
          <span className={`inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Capabilities
          </span>
          <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-950 mb-6 transition-all duration-500 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Powerful Tools for{' '}
            <span className="text-gradient">Growth</span>
          </h2>
          <p className={`text-lg text-gray-600 transition-all duration-500 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Everything you need to manage complex delivery networks with ease, 
            from dispatch to final delivery.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
  isVisible,
}: {
  feature: typeof features[0];
  index: number;
  isVisible: boolean;
}) {
  const Icon = feature.icon;

  return (
    <div
      className={`group relative bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
      }}
    >
      {/* Hover Gradient Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[2px]">
        <div className="w-full h-full bg-white rounded-2xl" />
      </div>

      <div className="relative">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Content */}
        <h3 className="font-display text-xl font-semibold text-navy-950 mb-3 group-hover:text-purple-600 transition-colors">
          {feature.title}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          {feature.description}
        </p>

        {/* Learn More Link */}
        <div className="flex items-center gap-2 text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="text-sm">Learn more</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

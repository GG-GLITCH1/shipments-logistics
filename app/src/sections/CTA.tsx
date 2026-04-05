import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package } from 'lucide-react';

export default function CTA() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-navy-950" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px),
                           linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div ref={ref} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Package className="w-8 h-8 text-white" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to revolutionize your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">
              delivery operations
            </span>?
          </h2>

          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Join over 500+ businesses using CashSupportShipment to manage millions of deliveries monthly. 
            Get in touch with us today.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/sign-up">
              <Button 
                size="lg" 
                className="h-14 px-8 bg-white text-navy-950 hover:bg-gray-100 shadow-lg transition-all duration-300 group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/track">
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300"
              >
                Track Package
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

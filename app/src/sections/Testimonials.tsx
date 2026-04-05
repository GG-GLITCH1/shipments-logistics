import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: '1',
    name: 'Daniel A.',
    role: 'Head of Operations',
    company: 'Online Marketplace',
    avatar: '/avatar-daniel.jpg',
    content: 'Before CashSupportShipment, managing multiple vendors felt chaotic. Now everything is centralized, trackable, and predictable.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Fatima R.',
    role: 'Customer Experience Lead',
    company: 'E-commerce Store',
    avatar: '/avatar-fatima.jpg',
    content: 'I love how transparent the delivery process is. I can see updates in real time. Our customers are happier than ever.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Blessing K.',
    role: 'Startup Logistics Lead',
    company: 'Tech Delivery',
    avatar: '/avatar-blessing.jpg',
    content: 'CashSupportShipment scaled with us. From 10 shipments a day to hundreds—no friction. The platform grows with your business.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Aisha M.',
    role: 'Operations Manager',
    company: 'Retail Chain',
    avatar: '/avatar-aisha.jpg',
    content: 'The tracking alone is worth it. Customers stopped calling to ask "where\'s my order?" It saved our support team countless hours.',
    rating: 5,
  },
  {
    id: '5',
    name: 'James L.',
    role: 'Founder',
    company: 'QuickShip Startup',
    avatar: '/avatar-startup.jpg',
    content: 'I didn\'t expect setup to be this fast. We were live in less than a day. The onboarding process is incredibly smooth.',
    rating: 5,
  },
  {
    id: '6',
    name: 'Sarah T.',
    role: 'VP of Logistics',
    company: 'Global Freight Co.',
    avatar: '/avatar-operations.jpg',
    content: 'CashSupportShipment made shipping across multiple vendors ridiculously easy. One dashboard, real-time tracking, zero stress.',
    rating: 5,
  },
];

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-gray-50/50">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative">
        {/* Section Header */}
        <div ref={ref} className="text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <span className={`inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Testimonials
          </span>
          <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-950 mb-6 transition-all duration-500 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Loved by Businesses{' '}
            <span className="text-gradient">Worldwide</span>
          </h2>
          <p className={`text-lg text-gray-600 transition-all duration-500 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Don&apos;t just take our word for it — hear what our customers have to say about their experience.
          </p>
        </div>

        {/* Marquee Row 1 */}
        <div 
          className="relative mb-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={`flex gap-6 ${isPaused ? '' : 'animate-marquee'}`}>
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={`row1-${testimonial.id}-${index}`} 
                testimonial={testimonial}
                isPaused={isPaused}
              />
            ))}
          </div>
        </div>

        {/* Marquee Row 2 (Reverse) */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={`flex gap-6 ${isPaused ? '' : 'animate-marquee-reverse'}`}>
            {[...duplicatedTestimonials].reverse().map((testimonial, index) => (
              <TestimonialCard 
                key={`row2-${testimonial.id}-${index}`} 
                testimonial={testimonial}
                isPaused={isPaused}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ 
  testimonial,
  isPaused,
}: { 
  testimonial: typeof testimonials[0];
  isPaused: boolean;
}) {
  return (
    <div 
      className={`flex-shrink-0 w-[400px] bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
        isPaused ? 'scale-100' : 'hover:scale-105'
      }`}
    >
      {/* Quote Icon */}
      <Quote className="w-8 h-8 text-purple-200 mb-4" />
      
      {/* Content */}
      <p className="text-gray-700 mb-6 leading-relaxed">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-navy-950">{testimonial.name}</p>
          <p className="text-sm text-gray-500">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

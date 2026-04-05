import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in minutes and configure your service areas, rates, and carrier partners in our intuitive dashboard.',
    image: '/step1-account.jpg',
  },
  {
    number: '02',
    title: 'Upload Your Fleet Data',
    description: 'Import your drivers, vehicles, and collection points. Assign roles and permissions to your logistics team.',
    image: '/step2-fleet.jpg',
  },
  {
    number: '03',
    title: 'Launch & Track',
    description: 'Start accepting orders. Your customers get real-time links to track their parcels on your branded portal.',
    image: '/step3-track.jpg',
  },
];

export default function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />
      
      {/* Decorative Elements */}
      <svg className="absolute top-20 left-0 w-full h-32 opacity-5" viewBox="0 0 1200 100" preserveAspectRatio="none">
        <path 
          d="M0,50 Q300,0 600,50 T1200,50" 
          fill="none" 
          stroke="#7f56d9" 
          strokeWidth="2"
          strokeDasharray="10,10"
        />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={ref} className="text-center max-w-3xl mx-auto mb-20">
          <span className={`inline-block px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            The Process
          </span>
          <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-950 mb-6 transition-all duration-500 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Get Started in{' '}
            <span className="text-gradient">Minutes</span>
          </h2>
          <p className={`text-lg text-gray-600 transition-all duration-500 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Our streamlined onboarding process gets you up and running quickly.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-20 lg:space-y-32">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              step={step}
              index={index}
              isReversed={index % 2 === 1}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Connector Line (Desktop) */}
        <div className="hidden lg:block absolute left-1/2 top-48 bottom-32 w-px bg-gradient-to-b from-purple-300 via-teal-300 to-purple-300" />
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  isReversed,
  isVisible,
}: {
  step: typeof steps[0];
  index: number;
  isReversed: boolean;
  isVisible: boolean;
}) {
  return (
    <div
      className={`relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Content */}
      <div className={`space-y-6 ${isReversed ? 'lg:order-2' : ''}`}>
        <div className="flex items-center gap-4">
          <span className="text-6xl lg:text-7xl font-display font-bold text-gradient opacity-30">
            {step.number}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-purple-300 to-transparent" />
        </div>
        
        <h3 className="font-display text-2xl lg:text-3xl font-bold text-navy-950">
          {step.title}
        </h3>
        
        <p className="text-lg text-gray-600 leading-relaxed">
          {step.description}
        </p>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i <= parseInt(step.number) ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Image */}
      <div className={`relative ${isReversed ? 'lg:order-1' : ''}`}>
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-200/50 to-teal-200/50 rounded-3xl blur-xl" />
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <img
            src={step.image}
            alt={step.title}
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Step Badge */}
        <div className={`absolute -top-4 ${isReversed ? '-right-4' : '-left-4'} w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center shadow-lg`}>
          <span className="text-white font-bold text-lg">{step.number}</span>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What is CashSupportShipment?',
    answer: 'CashSupportShipment is a multi-tenant logistics platform that empowers delivery businesses with seamless shipment tracking, logistics management, and P2P point systems. It helps you scale your fleet with confidence and provides real-time visibility into your entire delivery network.',
  },
  {
    question: 'Who can use CashSupportShipment?',
    answer: 'CashSupportShipment is designed for logistics companies, e-commerce businesses, delivery startups, and any organization that needs to manage shipments. Whether you\'re handling 10 packages a day or 10,000, our platform scales to meet your needs.',
  },
  {
    question: 'How does the point-based system work?',
    answer: 'Our P2P (Peer-to-Peer) point system optimizes logistics through localized collection points. Businesses earn points for efficient deliveries, successful pickups, and maintaining high service standards. These points can be used to access premium features, reduce fees, or unlock partnership benefits.',
  },
  {
    question: 'How do I get points?',
    answer: 'You earn points through various activities: completing deliveries on time, maintaining high customer ratings, referring new businesses to the platform, and participating in our partner network. The more active and efficient you are, the more points you accumulate.',
  },
  {
    question: 'Do I pay money for each delivery?',
    answer: 'Our pricing is flexible based on your business needs. We offer subscription plans for regular shippers and pay-per-use options for occasional deliveries. Contact our sales team for a customized quote that fits your volume and requirements.',
  },
  {
    question: 'What actions require points?',
    answer: 'Points are used for premium features like advanced analytics, priority support, custom branding options, and accessing our extended partner network. Basic tracking and shipment management are available without using points.',
  },
  {
    question: 'Can vendors and users both use points?',
    answer: 'Yes! Both vendors (delivery partners) and users (businesses shipping goods) can earn and use points. Vendors earn points for successful deliveries, while users earn points for loyalty, referrals, and consistent platform usage.',
  },
  {
    question: 'What happens if I run out of points?',
    answer: 'If you run out of points, you can continue using all basic features of the platform. Premium features will be temporarily unavailable until you earn more points or purchase a points package. We also offer monthly point subscriptions for businesses with consistent needs.',
  },
];

export default function FAQ() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={ref} className="text-center mb-16">
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <HelpCircle className="w-4 h-4" />
            FAQ
          </span>
          <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-950 mb-6 transition-all duration-500 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Frequently Asked{' '}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className={`text-lg text-gray-600 transition-all duration-500 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Everything you need to know about the platform. Can&apos;t find what you&apos;re looking for?{' '}
            <a href="#contact" className="text-purple-600 hover:underline font-medium">
              Contact our support team
            </a>.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-gray-50 rounded-2xl overflow-hidden transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
              >
                <span className="font-display font-semibold text-navy-950 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-purple-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

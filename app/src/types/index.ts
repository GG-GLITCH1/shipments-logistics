export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'admin' | 'user' | 'business';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  receiverName: string;
  receiverAddress: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  origin: string;
  destination: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
  trackingHistory: TrackingEvent[];
}

export interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Stats {
  totalShipments: number;
  inTransit: number;
  delivered: number;
  activeBusinesses: number;
  packagesTracked: number;
  uptimePercentage: number;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Step {
  id: string;
  number: number;
  title: string;
  description: string;
  image: string;
}

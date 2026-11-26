export type CategoryId =
  | 'todos'
  | 'climatizacao'
  | 'casa-reparos'
  | 'saude-estetica'
  | 'automotivo'
  | 'beleza'
  | 'tecnologia';

export type PlanTier = 'basico' | 'destaque' | 'premium';

export interface BusinessPlan {
  id: PlanTier;
  name: string;
  priceLabel: string;
  priceValue: number;
  billingCycle: string;
  summary: string;
  ctaLabel: string;
  recommended?: boolean;
  features: string[];
}

export interface ReviewItem {
  id: string;
  author: string;
  neighborhood: string;
  localGuideCount?: number;
  rating: number;
  dateLabel: string;
  serviceDone: string;
  comment: string;
  ownerReply?: string;
}

export interface ServiceOffering {
  name: string;
  priceFrom: string;
  duration: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  planTier: PlanTier;
  category: Exclude<CategoryId, 'todos'>;
  categoryLabel: string;
  neighborhood: string;
  address: string;
  coverage: string;
  whatsapp: string;
  whatsappDisplay: string;
  rating: number;
  reviewCount: number;
  ratingDistribution?: [number, number, number, number, number];
  googleMapsUrl?: string;
  responseTimeMinutes: number;
  startingPrice: string;
  openNow: boolean;
  homeService: boolean;
  verifiedSince: string;
  hours: string;
  summary: string;
  imageUrl?: string;
  imageAlt: string;
  services: ServiceOffering[];
  reviews: ReviewItem[];
}

export interface BookingLead {
  id: string;
  providerId: string;
  providerName: string;
  providerCategory: string;
  providerWhatsapp: string;
  clientName: string;
  clientNeighborhood: string;
  serviceRequested: string;
  preferredWindow: string;
  notes: string;
  createdAtLabel: string;
  status: 'Novo pedido' | 'Em atendimento' | 'Agendado';
  whatsappUrl: string;
}

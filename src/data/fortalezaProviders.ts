import { BookingLead, BusinessPlan, CategoryId, ServiceProvider } from '../types/directory';

export const BUSINESS_PLANS: BusinessPlan[] = [
  {
    id: 'basico',
    name: 'Cadastro básico',
    priceLabel: 'Grátis',
    priceValue: 0,
    billingCycle: 'sem mensalidade',
    summary: 'Para começar a aparecer nas buscas por bairro e receber mensagens no WhatsApp.',
    ctaLabel: 'Começar grátis',
    features: [
      'Perfil completo no catálogo de Fortaleza',
      'Botão direto para agendamento no WhatsApp',
      'Exibição das avaliações do Google',
      'Ordem padrão nas buscas da categoria',
    ],
  },
  {
    id: 'destaque',
    name: 'Profissional em destaque',
    priceLabel: 'R$ 29,90',
    priceValue: 29.9,
    billingCycle: '/mês',
    summary: 'Para autônomos e especialistas que querem aparecer acima dos cadastros gratuitos.',
    ctaLabel: 'Assinar por R$ 29,90',
    recommended: true,
    features: [
      'Tudo do Cadastro básico incluído',
      'Posição prioritária acima dos perfis gratuitos',
      'Selo editorial de Profissional em destaque',
      'Cobertura ampliada para múltiplos bairros',
    ],
  },
  {
    id: 'premium',
    name: 'Empresa Premium',
    priceLabel: 'R$ 59,90',
    priceValue: 59.9,
    billingCycle: '/mês',
    summary: 'Máxima visibilidade no topo das buscas e prioridade absoluta no recebimento de clientes.',
    ctaLabel: 'Assinar por R$ 59,90',
    features: [
      'Tudo do Profissional em destaque incluído',
      'Topo absoluto da categoria e buscas na cidade',
      'Identificação de Empresa Premium nos resultados',
      'Prioridade no painel de recebimento de pedidos',
    ],
  },
];

export const CATEGORY_OPTIONS: { id: CategoryId; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'climatizacao', label: 'Climatização' },
  { id: 'casa-reparos', label: 'Casa e Reparos' },
  { id: 'saude-estetica', label: 'Saúde e Odonto' },
  { id: 'automotivo', label: 'Automotivo' },
  { id: 'beleza', label: 'Beleza e Bem-estar' },
  { id: 'tecnologia', label: 'Tecnologia' },
];

export const FORTALEZA_NEIGHBORHOODS: string[] = [
  'Todos os bairros',
  'Aldeota',
  'Meireles',
  'Edson Queiroz',
  'Fátima',
  'Dionísio Torres',
  'Cocó',
  'Praia de Iracema',
  'Benfica',
  'Itaperi',
  'Serrinha',
  'Conjunto Palmeiras',
  'Parquelândia',
  'Messejana',
  'Centro',
];

export const HERO_FORTALEZA_IMAGE =
  '/src/assets/images/hero_fortaleza_coast_1795704904770.jpg';

function makeGoogleMapsSearchUrl(name: string, address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${name} ${address} Fortaleza CE`
  )}`;
}

export const INITIAL_PROVIDERS: ServiceProvider[] = [
  {
    id: 'd7-climatizacao-ce',
    name: 'D7 Climatização',
    planTier: 'premium',
    category: 'climatizacao',
    categoryLabel: 'Climatização',
    neighborhood: 'Edson Queiroz',
    address: 'Av. Washington Soares, 855, Sala 704 · Edson Queiroz',
    coverage: 'Edson Queiroz, Cocó, Aldeota, Meireles e Água Fria',
    whatsapp: '5585992723325',
    whatsappDisplay: '(85) 99272-3325',
    rating: 4.9,
    reviewCount: 52,
    ratingDistribution: [48, 3, 1, 0, 0],
    googleMapsUrl: makeGoogleMapsSearchUrl(
      'D7 Climatização',
      'Av. Washington Soares, 855, Edson Queiroz'
    ),
    responseTimeMinutes: 3,
    startingPrice: 'R$ 130',
    openNow: true,
    homeService: true,
    verifiedSince: '2023',
    hours: 'Seg a Sáb · 08h00 às 18h00',
    summary:
      'Instalação, manutenção preventiva, higienização e projetos de climatização residencial e comercial em Fortaleza.',
    imageUrl: '/src/assets/images/service_ac_technician_1795704905140.jpg',
    imageAlt: 'Técnico realizando manutenção de ar-condicionado split — D7 Climatização Fortaleza',
    services: [
      { name: 'Higienização completa Split residencial', priceFrom: 'R$ 130', duration: '50 min' },
      { name: 'Instalação de Split Inverter com infraestrutura', priceFrom: 'R$ 420', duration: '2h30' },
      { name: 'Manutenção corretiva e recarga de fluido', priceFrom: 'R$ 190', duration: '1h' },
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Camila Vasconcelos',
        neighborhood: 'Cocó',
        localGuideCount: 24,
        rating: 5,
        dateLabel: 'há 1 semana',
        serviceDone: 'Higienização de ar-condicionado',
        comment:
          'Excelente atendimento desde o primeiro contato no WhatsApp. Técnico muito caprichoso na higienização dos dois splits aqui de casa, pontual e preço justo.',
        ownerReply:
          'Muito obrigado pela confiança, Camila! Conte sempre com a equipe da D7 Climatização.',
      },
      {
        id: 'rev-2',
        author: 'Rafael Pontes',
        neighborhood: 'Edson Queiroz',
        localGuideCount: 11,
        rating: 5,
        dateLabel: 'há 3 semanas',
        serviceDone: 'Instalação de split inverter',
        comment:
          'Serviço muito organizado. Fizeram a instalação com vácuo na tubulação e deixaram tudo funcionando perfeitamente.',
      },
    ],
  },
  {
    id: 'sorridents-aldeota',
    name: 'Sorridents Fortaleza Aldeota',
    planTier: 'premium',
    category: 'saude-estetica',
    categoryLabel: 'Saúde e Odonto',
    neighborhood: 'Aldeota',
    address: 'Av. Barão de Studart, 350 · Aldeota',
    coverage: 'Aldeota, Meireles e Dionísio Torres',
    whatsapp: '5585994095392',
    whatsappDisplay: '(85) 99409-5392',
    rating: 4.5,
    reviewCount: 157,
    ratingDistribution: [118, 20, 8, 5, 6],
    googleMapsUrl: makeGoogleMapsSearchUrl(
      'Sorridents Fortaleza Aldeota',
      'Av. Barão de Studart, 350, Aldeota'
    ),
    responseTimeMinutes: 4,
    startingPrice: 'R$ 160',
    openNow: true,
    homeService: false,
    verifiedSince: '2022',
    hours: 'Seg a Sex · 08h00 às 19h00 · Sáb até 13h',
    summary:
      'Clínica odontológica completa na Av. Barão de Studart: clínica geral, endodontia, implantes, ortodontia e profilaxia.',
    imageUrl: '/src/assets/images/service_dental_clinic_1795704905562.jpg',
    imageAlt: 'Recepção contemporânea — Sorridents Fortaleza Aldeota na Av. Barão de Studart',
    services: [
      { name: 'Avaliação odontológica + profilaxia', priceFrom: 'R$ 160', duration: '45 min' },
      { name: 'Tratamento de canal (Endodontia)', priceFrom: 'Sob avaliação', duration: '1h' },
      { name: 'Clareamento dental supervisionado', priceFrom: 'R$ 590', duration: '1h15' },
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'Beatriz Linhares',
        neighborhood: 'Aldeota',
        localGuideCount: 38,
        rating: 5,
        dateLabel: 'há 5 dias',
        serviceDone: 'Avaliação e limpeza',
        comment:
          'Atendimento muito acolhedor desde a recepção até a dentista. Consegui agendar direto pelo WhatsApp para o mesmo dia na Barão de Studart.',
        ownerReply:
          'Ficamos felizes com sua avaliação, Beatriz! Obrigada por escolher a Sorridents Aldeota.',
      },
      {
        id: 'rev-3b',
        author: 'Henrique Alencar',
        neighborhood: 'Meireles',
        localGuideCount: 15,
        rating: 4,
        dateLabel: 'há 2 semanas',
        serviceDone: 'Endodontia',
        comment:
          'Profissionais muito atenciosos e clínica bem estruturada. Só houve uma pequena espera de 10 minutos na recepção.',
      },
    ],
  },
  {
    id: 'rocha-auto-center-fatima',
    name: 'Rocha Auto Center',
    planTier: 'destaque',
    category: 'automotivo',
    categoryLabel: 'Automotivo',
    neighborhood: 'Fátima',
    address: 'Av. Aguanambi, 1515 · Bairro de Fátima',
    coverage: 'Fátima, Benfica, Aldeota e Centro',
    whatsapp: '5585998948149',
    whatsappDisplay: '(85) 99894-8149',
    rating: 4.9,
    reviewCount: 117,
    ratingDistribution: [108, 6, 2, 1, 0],
    googleMapsUrl: makeGoogleMapsSearchUrl(
      'Rocha Auto Center',
      'Av. Aguanambi, 1515, Fátima'
    ),
    responseTimeMinutes: 5,
    startingPrice: 'R$ 140',
    openNow: true,
    homeService: false,
    verifiedSince: '2021',
    hours: 'Seg a Sex · 07h30 às 18h00 · Sáb até 12h30',
    summary:
      'Oficina mecânica na Av. Aguanambi credenciada Bosch Car Service: diagnóstico honesto, freios, suspensão e revisão preventiva.',
    imageUrl: '/src/assets/images/service_auto_workshop_1795704905998.jpg',
    imageAlt: 'Centro automotivo moderno — Rocha Auto Center na Av. Aguanambi, Fátima',
    services: [
      { name: 'Revisão preventiva + diagnóstico mecânico', priceFrom: 'R$ 140', duration: '1h' },
      { name: 'Revisão de sistema de freios', priceFrom: 'R$ 220', duration: '1h30' },
      { name: 'Manutenção de suspensão e troca de óleo', priceFrom: 'R$ 180', duration: '1h' },
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'Thiago Nogueira',
        neighborhood: 'Fátima',
        localGuideCount: 42,
        rating: 5,
        dateLabel: 'há 4 dias',
        serviceDone: 'Diagnóstico e freios',
        comment:
          'Diagnóstico honesto e transparência total no orçamento. Mostraram exatamente o que precisava ser trocado sem empurrar serviço desnecessário.',
        ownerReply:
          'Obrigado pelo reconhecimento, Thiago! Transparência é prioridade aqui na Rocha Auto Center.',
      },
    ],
  },
  {
    id: 'beauty-conceito-aldeota',
    name: 'Beauty Conceito',
    planTier: 'destaque',
    category: 'beleza',
    categoryLabel: 'Beleza e Bem-estar',
    neighborhood: 'Aldeota',
    address: 'Rua Eduardo Salgado, 95 · Aldeota',
    coverage: 'Aldeota, Meireles e Dionísio Torres',
    whatsapp: '5585996922844',
    whatsappDisplay: '(85) 99692-2844',
    rating: 4.9,
    reviewCount: 238,
    ratingDistribution: [219, 14, 3, 1, 1],
    googleMapsUrl: makeGoogleMapsSearchUrl(
      'Beauty Conceito',
      'Rua Eduardo Salgado, 95, Aldeota'
    ),
    responseTimeMinutes: 3,
    startingPrice: 'R$ 110',
    openNow: true,
    homeService: false,
    verifiedSince: '2023',
    hours: 'Ter a Sáb · 09h00 às 19h30',
    summary:
      'Salão de beleza na Aldeota especializado em corte, mechas, coloração, manicure, sobrancelhas e estética facial.',
    imageUrl: '/src/assets/images/service_beauty_studio_1795704906541.jpg',
    imageAlt: 'Interior contemporâneo do salão Beauty Conceito na Aldeota',
    services: [
      { name: 'Corte + finalização', priceFrom: 'R$ 135', duration: '1h' },
      { name: 'Escova modelada + hidratação', priceFrom: 'R$ 110', duration: '55 min' },
      { name: 'Mechas e tratamento capilar', priceFrom: 'R$ 480', duration: '3h' },
    ],
    reviews: [
      {
        id: 'rev-5',
        author: 'Larissa Frota',
        neighborhood: 'Aldeota',
        localGuideCount: 19,
        rating: 5,
        dateLabel: 'ontem',
        serviceDone: 'Corte e mechas',
        comment:
          'Ambiente lindo, equipe super atenciosa e resultado maravilhoso no cabelo. Sempre marco pelo WhatsApp.',
      },
    ],
  },
  {
    id: 'eletricista-on-meireles',
    name: 'Eletricista & Manutenções ON',
    planTier: 'destaque',
    category: 'casa-reparos',
    categoryLabel: 'Casa e Reparos',
    neighborhood: 'Meireles',
    address: 'Rua Ana Bilhar · Meireles',
    coverage: 'Meireles, Aldeota, Cocó, Dionísio Torres e toda Fortaleza',
    whatsapp: '5585991604458',
    whatsappDisplay: '(85) 99160-4458',
    rating: 4.9,
    reviewCount: 48,
    ratingDistribution: [44, 3, 1, 0, 0],
    googleMapsUrl: makeGoogleMapsSearchUrl(
      'Eletricista Manutenções ON',
      'Rua Ana Bilhar, Meireles'
    ),
    responseTimeMinutes: 4,
    startingPrice: 'R$ 95',
    openNow: true,
    homeService: true,
    verifiedSince: '2022',
    hours: 'Seg a Sáb · 07h30 às 20h00',
    summary:
      'Instalações e manutenções elétricas residenciais e comerciais em Fortaleza: quadros de disjuntores, tomadas, luminárias e chuveiros.',
    imageUrl: '/src/assets/images/service_electrician_home_1795705822255.jpg',
    imageAlt: 'Eletricista realizando inspeção de quadro de disjuntores no Meireles',
    services: [
      { name: 'Visita técnica e diagnóstico elétrico', priceFrom: 'R$ 95', duration: '45 min' },
      { name: 'Instalação de chuveiro ou ponto 220V', priceFrom: 'R$ 140', duration: '1h' },
      { name: 'Revisão de quadro de distribuição', priceFrom: 'R$ 160', duration: '1h30' },
    ],
    reviews: [
      {
        id: 'rev-6',
        author: 'Marcos Bezerra',
        neighborhood: 'Meireles',
        localGuideCount: 29,
        rating: 5,
        dateLabel: 'há 2 dias',
        serviceDone: 'Troca de disjuntor e revisão elétrica',
        comment:
          'Atendimento muito rápido e profissional. Resolveu uma queda de fase no apartamento com segurança e organização.',
      },
    ],
  },
  {
    id: 'help-informatica-dionisio',
    name: 'Help Informática',
    planTier: 'basico',
    category: 'tecnologia',
    categoryLabel: 'Tecnologia',
    neighborhood: 'Dionísio Torres',
    address: 'Rua Israel Bezerra, 927 · Dionísio Torres',
    coverage: 'Dionísio Torres, Aldeota, Cocó e toda Fortaleza',
    whatsapp: '5585999600093',
    whatsappDisplay: '(85) 99960-0093',
    rating: 4.9,
    reviewCount: 412,
    ratingDistribution: [381, 22, 5, 2, 2],
    googleMapsUrl: makeGoogleMapsSearchUrl(
      'Help Informática',
      'Rua Israel Bezerra, 927, Dionísio Torres'
    ),
    responseTimeMinutes: 4,
    startingPrice: 'R$ 120',
    openNow: true,
    homeService: false,
    verifiedSince: '2023',
    hours: 'Seg a Sex · 08h30 às 18h00 · Sáb até 12h30',
    summary:
      'Assistência técnica especializada em reparos avançados de placas em notebooks, MacBooks e PCs gamers no Dionísio Torres.',
    imageUrl: '/src/assets/images/service_laptop_repair_1795705824029.jpg',
    imageAlt: 'Bancada técnica especializada em reparo de notebooks — Help Informática Dionísio Torres',
    services: [
      { name: 'Limpeza interna + troca de pasta térmica', priceFrom: 'R$ 120', duration: '2h' },
      { name: 'Upgrade de SSD e memória RAM', priceFrom: 'R$ 180', duration: '3h' },
      { name: 'Diagnóstico e reparo de placa-mãe', priceFrom: 'R$ 240', duration: 'Sob análise' },
    ],
    reviews: [
      {
        id: 'rev-7',
        author: 'Juliana Arruda',
        neighborhood: 'Dionísio Torres',
        localGuideCount: 54,
        rating: 5,
        dateLabel: 'há 6 dias',
        serviceDone: 'Reparo em placa de MacBook',
        comment:
          'Orçamento enviado por escrito antes de iniciar o serviço e cumprimento rigoroso do prazo. Excelente assistência em Fortaleza.',
        ownerReply:
          'Agradecemos a avaliação, Juliana! Ficamos à disposição sempre que precisar.',
      },
    ],
  },
  {
    id: 'arbem-climatizacao-itaperi',
    name: 'Arbem Climatização',
    planTier: 'basico',
    category: 'climatizacao',
    categoryLabel: 'Climatização',
    neighborhood: 'Itaperi',
    address: 'Rua Doutor Manoel Teófilo, 137A · Itaperi',
    coverage: 'Itaperi, Serrinha, Parangaba, Messejana e Benfica',
    whatsapp: '5585992187892',
    whatsappDisplay: '(85) 99218-7892',
    rating: 4.9,
    reviewCount: 108,
    ratingDistribution: [99, 7, 1, 1, 0],
    googleMapsUrl: makeGoogleMapsSearchUrl(
      'Arbem Climatização',
      'Rua Doutor Manoel Teófilo, 137A, Itaperi'
    ),
    responseTimeMinutes: 5,
    startingPrice: 'R$ 120',
    openNow: true,
    homeService: true,
    verifiedSince: '2022',
    hours: 'Seg a Sáb · 08h00 às 18h00',
    summary:
      'Instalação, higienização e conserto de ar-condicionado residencial e comercial em Fortaleza.',
    imageUrl: '/src/assets/images/service_hvac_condenser_1795705824011.jpg',
    imageAlt: 'Técnica verificando pressão de gás em condensadora split — Arbem Climatização Itaperi',
    services: [
      { name: 'Higienização Split 9.000 a 12.000 BTUs', priceFrom: 'R$ 120', duration: '50 min' },
      { name: 'Conserto e manutenção de condensadora', priceFrom: 'R$ 160', duration: '1h20' },
    ],
    reviews: [
      {
        id: 'rev-8',
        author: 'Eduardo Maia',
        neighborhood: 'Itaperi',
        localGuideCount: 17,
        rating: 5,
        dateLabel: 'há 4 dias',
        serviceDone: 'Higienização e recarga de gás',
        comment:
          'Muito educados, pontuais e já passaram o valor certinho pelo WhatsApp antes de vir.',
      },
    ],
  },
  {
    id: 'de-marcenaria-atelie',
    name: 'DE Marcenaria e Ateliê',
    planTier: 'basico',
    category: 'casa-reparos',
    categoryLabel: 'Casa e Reparos',
    neighborhood: 'Praia de Iracema',
    address: 'Rua Almirante Jaceguai, 249 · Praia de Iracema',
    coverage: 'Praia de Iracema, Centro, Meireles, Aldeota e toda Fortaleza',
    whatsapp: '5585988092688',
    whatsappDisplay: '(85) 98809-2688',
    rating: 5.0,
    reviewCount: 54,
    ratingDistribution: [54, 0, 0, 0, 0],
    googleMapsUrl: makeGoogleMapsSearchUrl(
      'DE Marcenaria e Ateliê',
      'Rua Almirante Jaceguai, 249, Praia de Iracema'
    ),
    responseTimeMinutes: 6,
    startingPrice: 'R$ 150',
    openNow: true,
    homeService: true,
    verifiedSince: '2024',
    hours: 'Seg a Sáb · 08h00 às 18h00',
    summary:
      'Fabricação de móveis de madeira sob medida, painéis, reparos e acabamentos personalizados em Fortaleza.',
    imageUrl: '/src/assets/images/service_carpentry_woodwork_1795705824509.jpg',
    imageAlt: 'Marceneiro instalando estante sob medida — DE Marcenaria e Ateliê Fortaleza',
    services: [
      { name: 'Orçamento de móveis e acabamentos sob medida', priceFrom: 'Gratuito', duration: '45 min' },
      { name: 'Reparo, montagem e ajuste em marcenaria', priceFrom: 'R$ 150', duration: '2h' },
    ],
    reviews: [
      {
        id: 'rev-9',
        author: 'Renata Queiroz',
        neighborhood: 'Meireles',
        localGuideCount: 31,
        rating: 5,
        dateLabel: 'há 1 semana',
        serviceDone: 'Estante em madeira sob medida',
        comment:
          'Acabamento impecável, madeira de excelente qualidade e prazo cumprido à risca.',
      },
    ],
  },
];

export const INITIAL_LEADS: BookingLead[] = [
  {
    id: 'lead-101',
    providerId: 'd7-climatizacao-ce',
    providerName: 'D7 Climatização',
    providerCategory: 'Climatização',
    providerWhatsapp: '5585992723325',
    clientName: 'Fernanda Siqueira',
    clientNeighborhood: 'Cocó',
    serviceRequested: 'Higienização completa Split residencial',
    preferredWindow: 'Hoje · Tarde (14h–17h)',
    notes: 'Apartamento próximo ao Parque do Cocó, 2 aparelhos.',
    createdAtLabel: 'Há 6 min',
    status: 'Novo pedido',
    whatsappUrl: 'https://wa.me/5585992723325',
  },
  {
    id: 'lead-102',
    providerId: 'rocha-auto-center-fatima',
    providerName: 'Rocha Auto Center',
    providerCategory: 'Automotivo',
    providerWhatsapp: '5585998948149',
    clientName: 'Gustavo Holanda',
    clientNeighborhood: 'Fátima',
    serviceRequested: 'Revisão preventiva + diagnóstico mecânico',
    preferredWindow: 'Amanhã · Manhã (08h–11h)',
    notes: 'Revisão antes de viagem.',
    createdAtLabel: 'Há 19 min',
    status: 'Em atendimento',
    whatsappUrl: 'https://wa.me/5585998948149',
  },
  {
    id: 'lead-103',
    providerId: 'sorridents-aldeota',
    providerName: 'Sorridents Fortaleza Aldeota',
    providerCategory: 'Saúde e Odonto',
    providerWhatsapp: '5585994095392',
    clientName: 'Helena Matos',
    clientNeighborhood: 'Aldeota',
    serviceRequested: 'Avaliação odontológica + profilaxia',
    preferredWindow: 'Amanhã · Tarde (15h–18h)',
    notes: 'Primeira consulta.',
    createdAtLabel: 'Há 42 min',
    status: 'Agendado',
    whatsappUrl: 'https://wa.me/5585994095392',
  },
];

export function buildWhatsappUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  const formatted = digits.startsWith('55') ? digits : `55${digits}`;
  return `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
}

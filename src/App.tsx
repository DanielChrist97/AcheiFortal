import { useState, useMemo, useEffect, FormEvent } from 'react';
import {
  Search,
  MapPin,
  MessageCircle,
  Check,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Header } from './components/Header';
import { ProviderCard } from './components/ProviderCard';
import { BookingModal } from './components/BookingModal';
import { ProviderDetailModal } from './components/ProviderDetailModal';
import { RegisterBusinessModal } from './components/RegisterBusinessModal';
import { ResilientImage } from './components/ResilientImage';
import { GoogleLogoMark, GoogleStarsRow } from './components/GoogleReviewsBadge';
import { BrandLogo } from './components/BrandLogo';
import {
  BUSINESS_PLANS,
  CATEGORY_OPTIONS,
  FORTALEZA_NEIGHBORHOODS,
  HERO_FORTALEZA_IMAGE,
  INITIAL_LEADS,
  INITIAL_PROVIDERS,
  buildWhatsappUrl,
} from './data/fortalezaProviders';
import {
  BookingLead,
  CategoryId,
  PlanTier,
  ReviewItem,
  ServiceProvider,
} from './types/directory';

const STORAGE_PROVIDERS_KEY = 'achei_fortaleza_providers_v5';
const STORAGE_LEADS_KEY = 'achei_fortaleza_leads_v3';

const PLAN_PRIORITY: Record<PlanTier, number> = {
  premium: 3,
  destaque: 2,
  basico: 1,
};

type SortOption = 'rating' | 'fastest' | 'reviews';

export default function App() {
  const [providers, setProviders] = useState<ServiceProvider[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROVIDERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const initialMap = new Map(INITIAL_PROVIDERS.map((ip) => [ip.id, ip]));
          return parsed
            .filter((p: ServiceProvider) => p.name?.trim().toLowerCase() !== 'hahsh')
            .map((p: ServiceProvider) => {
              const fresh = initialMap.get(p.id);
              return {
                ...p,
                planTier: p.planTier || 'basico',
                imageUrl: fresh ? fresh.imageUrl : p.imageUrl,
                imageAlt: fresh ? fresh.imageAlt : p.imageAlt,
              };
            });
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_PROVIDERS;
  });

  const [leads, setLeads] = useState<BookingLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEADS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(
            (l: BookingLead) => l.providerName?.trim().toLowerCase() !== 'hahsh'
          );
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_LEADS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos os bairros');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [onlyHomeService, setOnlyHomeService] = useState(false);

  const [bookingProvider, setBookingProvider] = useState<ServiceProvider | null>(null);
  const [detailProviderId, setDetailProviderId] = useState<string | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerPlan, setRegisterPlan] = useState<PlanTier>('destaque');

  const openRegisterWithPlan = (plan: PlanTier) => {
    setRegisterPlan(plan);
    setIsRegisterOpen(true);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROVIDERS_KEY, JSON.stringify(providers));
    } catch {
      // ignore storage errors
    }
  }, [providers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
    } catch {
      // ignore storage errors
    }
  }, [leads]);

  const detailProvider = useMemo(
    () => providers.find((p) => p.id === detailProviderId) || null,
    [providers, detailProviderId]
  );

  const filteredProviders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = providers.filter((provider) => {
      if (selectedCategory !== 'todos' && provider.category !== selectedCategory) {
        return false;
      }

      if (selectedNeighborhood !== 'Todos os bairros') {
        const matchBase = provider.neighborhood === selectedNeighborhood;
        const matchCoverage = provider.coverage
          .toLowerCase()
          .includes(selectedNeighborhood.toLowerCase());
        if (!matchBase && !matchCoverage) return false;
      }

      if (onlyOpenNow && !provider.openNow) return false;
      if (onlyHomeService && !provider.homeService) return false;

      if (q) {
        const searchable = [
          provider.name,
          provider.categoryLabel,
          provider.neighborhood,
          provider.summary,
          ...provider.services.map((s) => s.name),
        ]
          .join(' ')
          .toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      return true;
    });

    return [...matches].sort((a, b) => {
      if (sortBy === 'fastest') {
        return a.responseTimeMinutes - b.responseTimeMinutes;
      }
      if (sortBy === 'reviews') {
        return b.reviewCount - a.reviewCount;
      }
      const tierDiff = PLAN_PRIORITY[b.planTier] - PLAN_PRIORITY[a.planTier];
      if (tierDiff !== 0) return tierDiff;
      return b.rating - a.rating || b.reviewCount - a.reviewCount;
    });
  }, [
    providers,
    searchQuery,
    selectedCategory,
    selectedNeighborhood,
    sortBy,
    onlyOpenNow,
    onlyHomeService,
  ]);

  const handleHeroSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const target = document.getElementById('servicos');
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateLead = (newLead: BookingLead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleAdvanceLeadStatus = (leadId: string) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        if (lead.status === 'Novo pedido') {
          return { ...lead, status: 'Em atendimento' };
        }
        if (lead.status === 'Em atendimento') {
          return { ...lead, status: 'Agendado' };
        }
        return lead;
      })
    );
  };

  const handleAddReview = (providerId: string, newReview: ReviewItem) => {
    setProviders((prev) =>
      prev.map((provider) => {
        if (provider.id !== providerId) return provider;
        const updatedReviews = [newReview, ...provider.reviews];
        const totalReviews = provider.reviewCount + 1;
        const recalculatedRating = Number(
          ((provider.rating * provider.reviewCount + newReview.rating) / totalReviews).toFixed(1)
        );
        const currentDist: [number, number, number, number, number] = provider.ratingDistribution
          ? [...provider.ratingDistribution] as [number, number, number, number, number]
          : [provider.reviewCount, 0, 0, 0, 0];
        const bucketIdx = Math.min(4, Math.max(0, 5 - newReview.rating));
        currentDist[bucketIdx] += 1;
        return {
          ...provider,
          reviews: updatedReviews,
          reviewCount: totalReviews,
          rating: Math.min(5, recalculatedRating),
          ratingDistribution: currentDist,
        };
      })
    );
  };

  const handleRegisterProvider = (newProvider: ServiceProvider) => {
    setProviders((prev) => [newProvider, ...prev]);
    setSelectedCategory('todos');
    setSelectedNeighborhood('Todos os bairros');
    setSearchQuery('');
  };

  const handleDeleteProvider = (providerId: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== providerId));
    setLeads((prev) => prev.filter((l) => l.providerId !== providerId));
    if (detailProviderId === providerId) setDetailProviderId(null);
    if (bookingProvider?.id === providerId) setBookingProvider(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('todos');
    setSelectedNeighborhood('Todos os bairros');
    setOnlyOpenNow(false);
    setOnlyHomeService(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0F1D2E]">
      <Header onOpenRegister={() => setIsRegisterOpen(true)} />

      <main className="flex-1">
        {/* Hero Split */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 pb-12 lg:pt-14 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-sm font-medium text-[#475569]">
                Fortaleza e Região Metropolitana · Atendimento direto sem intermediários
              </p>

              <h1 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-bold tracking-tight text-[#0F1D2E] leading-[1.08] mt-3 text-balance">
                Encontre o serviço certo em Fortaleza e agende pelo WhatsApp.
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed mt-4 max-w-[60ch]">
                Escolha o que você precisa, compare empresas e profissionais avaliados no seu bairro e fale direto no WhatsApp para confirmar o atendimento em poucos minutos.
              </p>

              <form
                onSubmit={handleHeroSearchSubmit}
                className="mt-7 p-2 bg-white border border-[#E5E3DC] rounded-xl shadow-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6 relative flex items-center">
                    <Search
                      className="w-4 h-4 text-[#64748B] absolute left-3.5 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Qual serviço procura? Ex: ar-condicionado, dentista..."
                      aria-label="Qual serviço procura"
                      className="w-full pl-10 pr-3 py-3 text-sm bg-transparent text-[#0F1D2E] placeholder:text-[#64748B] focus:outline-none rounded-lg"
                    />
                  </div>

                  <div className="sm:col-span-3 relative flex items-center sm:border-l border-[#E5E3DC]">
                    <MapPin
                      className="w-4 h-4 text-[#64748B] absolute left-3 pointer-events-none"
                      aria-hidden="true"
                    />
                    <select
                      aria-label="Selecionar bairro em Fortaleza"
                      value={selectedNeighborhood}
                      onChange={(e) => setSelectedNeighborhood(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 text-sm bg-transparent text-[#0F1D2E] focus:outline-none rounded-lg cursor-pointer"
                    >
                      {FORTALEZA_NEIGHBORHOODS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="w-full h-full min-h-[44px] px-5 py-3 text-sm font-semibold text-white bg-[#0B8457] hover:bg-[#096B46] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Buscar agora
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#475569]">
                <span>Buscas frequentes:</span>
                {['Ar-condicionado', 'Eletricista', 'Odonto', 'Oficina', 'Cabelos'].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term === 'Odonto' ? 'odonto' : term);
                        document
                          .getElementById('servicos')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="font-medium text-[#0F1D2E] hover:text-[#0B8457] underline underline-offset-4 cursor-pointer"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-[#E5E3DC] bg-[#F2F0EB]">
                <ResilientImage
                  src={HERO_FORTALEZA_IMAGE}
                  alt="Orla e comércio local de Fortaleza sob sol da manhã"
                  title="Achei Fortaleza"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0F1D2E]/85 via-[#0F1D2E]/40 to-transparent p-5 text-white">
                  <p className="text-xs font-medium text-white/85">
                    Beira-Mar · Aldeota · Meireles · Cocó · Benfica · Messejana
                  </p>
                  <p className="font-display text-lg font-semibold mt-1">
                    Atendimento local avaliado por quem mora na cidade.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width 4-column metric strip */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 border border-[#E5E3DC] rounded-xl bg-white divide-y lg:divide-y-0 lg:divide-x divide-[#E5E3DC]">
            <div className="p-5">
              <p className="font-display text-2xl font-bold text-[#0F1D2E] tabular-nums">
                {providers.length} empresas ativas
              </p>
              <p className="text-sm text-[#475569] mt-1">
                Verificadas com WhatsApp direto
              </p>
            </div>
            <div className="p-5">
              <p className="font-display text-2xl font-bold text-[#0F1D2E] tabular-nums">
                14 bairros
              </p>
              <p className="text-sm text-[#475569] mt-1">
                Cobertura em Fortaleza e RMF
              </p>
            </div>
            <div className="p-5">
              <p className="font-display text-2xl font-bold text-[#0F1D2E] tabular-nums">
                &lt; 4 min
              </p>
              <p className="text-sm text-[#475569] mt-1">
                Resposta média no atendimento
              </p>
            </div>
            <div className="p-5">
              <p className="font-display text-2xl font-bold text-[#0F1D2E] tabular-nums">
                4,9 / 5,0
              </p>
              <p className="text-sm text-[#475569] mt-1">
                Nota média dos serviços avaliados
              </p>
            </div>
          </div>
        </section>

        {/* Directory Section */}
        <section
          id="servicos"
          className="border-t border-[#E5E3DC] bg-[#F5F4EF] py-14 sm:py-16"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F1D2E] text-balance">
                  Profissionais e empresas disponíveis hoje
                </h2>
                <p className="text-sm sm:text-base text-[#475569] mt-1.5">
                  Selecione o serviço, veja as avaliações reais e clique para agendar direto no WhatsApp.
                </p>
              </div>
              <p className="text-sm text-[#475569] tabular-nums shrink-0">
                Mostrando <strong className="text-[#0F1D2E]">{filteredProviders.length}</strong>{' '}
                {filteredProviders.length === 1 ? 'resultado' : 'resultados'}
              </p>
            </div>

            {/* Category filter tabs */}
            <div className="flex items-center gap-1.5 p-1.5 bg-[#EAE7DF] rounded-xl overflow-x-auto">
              {CATEGORY_OPTIONS.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#0F1D2E] shadow-sm'
                        : 'text-[#475569] hover:text-[#0F1D2E]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Secondary controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E5E3DC]">
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#334155]">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyOpenNow}
                    onChange={(e) => setOnlyOpenNow(e.target.checked)}
                    className="w-4 h-4 accent-[#0B8457] rounded"
                  />
                  <span>Aberto agora</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyHomeService}
                    onChange={(e) => setOnlyHomeService(e.target.checked)}
                    className="w-4 h-4 accent-[#0B8457] rounded"
                  />
                  <span>Atende em domicílio</span>
                </label>

                {(searchQuery ||
                  selectedCategory !== 'todos' ||
                  selectedNeighborhood !== 'Todos os bairros' ||
                  onlyOpenNow ||
                  onlyHomeService) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-[#0B8457] hover:underline underline-offset-4 cursor-pointer"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <label htmlFor="sort-providers" className="text-[#475569]">
                  Ordenar por:
                </label>
                <select
                  id="sort-providers"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-1.5 bg-white border border-[#D6D3C9] rounded-lg text-sm font-medium text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457] cursor-pointer"
                >
                  <option value="rating">Destaques e melhor avaliados</option>
                  <option value="fastest">Resposta mais rápida</option>
                  <option value="reviews">Mais avaliações</option>
                </select>
              </div>
            </div>

            {/* Cards Grid */}
            {filteredProviders.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    onBookWhatsapp={(p) => setBookingProvider(p)}
                    onViewDetails={(p) => setDetailProviderId(p.id)}
                    onDelete={
                      provider.id.startsWith('custom-')
                        ? (p) => handleDeleteProvider(p.id)
                        : undefined
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 p-10 text-center bg-white border border-[#E5E3DC] rounded-xl">
                <p className="font-display text-lg font-bold text-[#0F1D2E]">
                  Nenhum estabelecimento encontrado para esse filtro
                </p>
                <p className="text-sm text-[#475569] mt-1.5">
                  Tente buscar outro termo ou selecionar todos os bairros de Fortaleza.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-[#0B8457] hover:bg-[#096B46] rounded-lg transition-colors cursor-pointer"
                >
                  Mostrar todos os serviços
                </button>
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section id="como-funciona" className="py-14 sm:py-16 border-t border-[#E5E3DC]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F1D2E] text-balance">
                Simples do primeiro clique ao atendimento confirmado
              </h2>
              <p className="text-sm sm:text-base text-[#475569] mt-2">
                Sem cadastros longos nem taxas escondidas: conectamos o morador de Fortaleza diretamente ao WhatsApp de quem resolve.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01. Escolha o serviço',
                  title: 'Busque por categoria ou bairro',
                  desc: 'Selecione o que precisa e filtre pelos bairros de Fortaleza para achar quem atende perto de você.',
                },
                {
                  step: '02. Compare avaliações',
                  title: 'Veja notas e contatos diretos',
                  desc: 'Confira avaliações reais do Google, bairros atendidos e tempo médio de resposta.',
                },
                {
                  step: '03. Fale no WhatsApp',
                  title: 'Agende rápido e com segurança',
                  desc: 'Preencha seu turno preferido e envie a solicitação formatada direto para o WhatsApp oficial da empresa.',
                },
                {
                  step: '04. Atendimento imediato',
                  title: 'A empresa recebe na hora',
                  desc: 'O estabelecimento recebe os dados do seu pedido e inicia o atendimento sem filas ou intermediários.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-6 bg-white border border-[#E5E3DC] rounded-xl flex flex-col"
                >
                  <span className="text-xs font-semibold text-[#0B8457]">{item.step}</span>
                  <h3 className="font-display text-lg font-bold text-[#0F1D2E] mt-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Google Reviews Showcase */}
        <section
          id="avaliacoes"
          className="py-14 sm:py-16 border-t border-[#E5E3DC] bg-white"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#475569] mb-1.5">
                  <GoogleLogoMark className="w-4 h-4" />
                  <span>Avaliações do Google em Fortaleza</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F1D2E]">
                  Avaliações reais de quem já contratou
                </h2>
                <p className="text-sm sm:text-base text-[#475569] mt-1.5">
                  Notas sincronizadas com os perfis públicos das empresas no Google Maps.
                </p>
              </div>
              <a
                href="#servicos"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B8457] hover:underline underline-offset-4 whitespace-nowrap"
              >
                Escolher um profissional
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    'Excelente atendimento desde o primeiro contato no WhatsApp. Técnico muito caprichoso na higienização dos dois splits aqui de casa, pontual e preço justo.',
                  author: 'Camila Vasconcelos',
                  avatarBg: 'bg-[#1A73E8]',
                  meta: 'Local Guide · 24 avaliações',
                  date: 'há 1 semana',
                  business: 'D7 Climatização · Cocó',
                  rating: 5,
                },
                {
                  quote:
                    'Diagnóstico honesto e transparência total no orçamento. Mostraram exatamente o que precisava ser trocado sem empurrar serviço desnecessário.',
                  author: 'Thiago Nogueira',
                  avatarBg: 'bg-[#0B8457]',
                  meta: 'Local Guide · 42 avaliações',
                  date: 'há 4 dias',
                  business: 'Rocha Auto Center · Fátima',
                  rating: 5,
                },
                {
                  quote:
                    'Orçamento enviado por escrito antes de iniciar o serviço e cumprimento rigoroso do prazo. Excelente assistência em Fortaleza.',
                  author: 'Juliana Arruda',
                  avatarBg: 'bg-[#E37400]',
                  meta: 'Local Guide · 54 avaliações',
                  date: 'há 6 dias',
                  business: 'Help Informática · Dionísio Torres',
                  rating: 5,
                },
              ].map((rev) => (
                <article
                  key={rev.author}
                  className="p-6 bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${rev.avatarBg} text-white flex items-center justify-center text-sm font-semibold shrink-0`}
                          aria-hidden="true"
                        >
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0F1D2E] leading-tight">
                            {rev.author}
                          </p>
                          <p className="text-xs text-[#64748B] mt-0.5 tabular-nums">
                            {rev.meta}
                          </p>
                        </div>
                      </div>
                      <GoogleLogoMark className="w-4 h-4 shrink-0 mt-0.5" />
                    </div>

                    <div className="flex items-center gap-2 mt-3.5 text-xs text-[#64748B]">
                      <GoogleStarsRow rating={rev.rating} size="xs" />
                      <span>{rev.date}</span>
                    </div>

                    <p className="text-sm text-[#334155] leading-relaxed mt-3">
                      {rev.quote}
                    </p>
                  </div>

                  <footer className="mt-5 pt-4 border-t border-[#E5E3DC] text-xs font-medium text-[#475569]">
                    Avaliação no Google · <span className="text-[#0F1D2E]">{rev.business}</span>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Establishment Live Reception Panel & Partner CTA */}
        <section
          id="para-empresas"
          className="py-14 sm:py-16 bg-[#0F1D2E] text-white border-t border-[#1E293B]"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5">
                <p className="text-xs font-medium text-[#6EE7B7] tracking-wide">
                  Para empresas e autônomos de Fortaleza
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-2 leading-tight text-balance">
                  Receba o cliente pronto para agendar direto no seu WhatsApp
                </h2>
                <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed mt-4">
                  Quando um cliente clica em agendar no Achei Fortaleza, você recebe o nome, o bairro, o serviço desejado e o melhor horário — pronto para iniciar o atendimento imediatamente.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-[#E2E8F0]">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                    <span>Pedidos chegam com bairro e serviço já preenchidos</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                    <span>Construa reputação local com avaliações reais por bairro</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                    <span>Atenda direto no seu WhatsApp comercial sem comissões por conversa</span>
                  </li>
                </ul>

                <div className="mt-7">
                  <button
                    type="button"
                    onClick={() => openRegisterWithPlan('destaque')}
                    className="px-5 py-3 min-h-[44px] text-sm font-semibold text-[#0F1D2E] bg-[#34D399] hover:bg-[#10B981] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Escolher plano e cadastrar
                  </button>
                </div>
              </div>

              {/* Live Establishment Lead Queue */}
              <div className="lg:col-span-7 bg-[#16263A] border border-[#263B54] rounded-2xl p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#263B54]">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      Painel de recebimento do estabelecimento
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Agendamentos enviados pelos clientes no site aparecem aqui em tempo real.
                    </p>
                  </div>
                  <span className="text-xs font-medium text-[#CBD5E1] tabular-nums shrink-0">
                    {leads.length} solicitações recentes
                  </span>
                </div>

                <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {leads.slice(0, 6).map((lead) => (
                    <div
                      key={lead.id}
                      className="p-4 rounded-xl bg-[#0F1D2E] border border-[#263B54] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
                          <span className="font-semibold text-white">{lead.clientName}</span>
                          <span aria-hidden="true">·</span>
                          <span>{lead.clientNeighborhood}</span>
                          <span aria-hidden="true">·</span>
                          <span>{lead.createdAtLabel}</span>
                        </div>
                        <p className="text-sm font-medium text-[#E2E8F0] truncate">
                          {lead.serviceRequested}
                        </p>
                        <p className="text-xs text-[#94A3B8]">
                          Para: <span className="text-[#CBD5E1]">{lead.providerName}</span> ·{' '}
                          {lead.preferredWindow}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className={`text-xs font-medium ${
                            lead.status === 'Agendado'
                              ? 'text-[#34D399]'
                              : lead.status === 'Em atendimento'
                                ? 'text-[#FBBF24]'
                                : 'text-[#93C5FD]'
                          }`}
                        >
                          {lead.status}
                        </span>

                        {lead.status !== 'Agendado' ? (
                          <button
                            type="button"
                            onClick={() => handleAdvanceLeadStatus(lead.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F1D2E] bg-white hover:bg-[#E2E8F0] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            {lead.status === 'Novo pedido'
                              ? 'Iniciar atendimento'
                              : 'Confirmar horário'}
                          </button>
                        ) : (
                          <a
                            href={buildWhatsappUrl(
                              lead.providerWhatsapp,
                              `Olá! Confirmando atendimento de ${lead.clientName} (${lead.serviceRequested}).`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#CBD5E1] bg-[#1E324B] hover:bg-[#263B54] rounded-lg transition-colors whitespace-nowrap"
                          >
                            WhatsApp
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3-Tier Business Pricing Plans */}
            <div className="mt-14 pt-12 border-t border-[#1E293B]">
              <div className="max-w-2xl">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white text-balance">
                  Planos para aparecer no Achei Fortaleza
                </h3>
                <p className="text-sm text-[#CBD5E1] mt-1.5">
                  Comece gratuitamente ou posicione seu negócio no topo das buscas do seu bairro em Fortaleza.
                </p>
              </div>

              <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-6">
                {BUSINESS_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-6 rounded-2xl border flex flex-col justify-between ${
                      plan.recommended
                        ? 'bg-[#16263A] border-[#34D399]'
                        : 'bg-[#122033] border-[#263B54]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-white">
                          {plan.name}
                        </span>
                        {plan.recommended && (
                          <span className="text-xs font-medium text-[#34D399]">
                            Mais escolhido
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-baseline gap-1.5 tabular-nums">
                        <span className="font-display text-3xl font-bold text-white">
                          {plan.priceLabel}
                        </span>
                        <span className="text-xs text-[#94A3B8]">
                          {plan.billingCycle}
                        </span>
                      </div>

                      <p className="text-sm text-[#CBD5E1] leading-relaxed mt-3">
                        {plan.summary}
                      </p>

                      <ul className="mt-5 pt-5 border-t border-[#263B54] space-y-2.5 text-sm text-[#E2E8F0]">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => openRegisterWithPlan(plan.id)}
                      className={`mt-7 w-full py-3 px-4 min-h-[44px] text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        plan.recommended
                          ? 'bg-[#34D399] hover:bg-[#10B981] text-[#0F1D2E]'
                          : plan.id === 'premium'
                            ? 'bg-white hover:bg-[#E2E8F0] text-[#0F1D2E]'
                            : 'bg-[#1E324B] hover:bg-[#263B54] text-white'
                      }`}
                    >
                      {plan.ctaLabel}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-[#E5E3DC] bg-[#FAF9F6] py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-[#475569]">
          <div className="flex flex-wrap items-center gap-2.5">
            <BrandLogo className="w-6 h-6 shrink-0" />
            <span className="font-display font-bold text-[#0F1D2E]">
              Achei <span className="text-[#0B8457]">Fortaleza</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Guia local de serviços e agendamento direto em Fortaleza, CE</span>
          </div>
          <div className="flex items-center gap-6 text-xs sm:text-sm">
            <a href="#servicos" className="hover:text-[#0F1D2E] transition-colors">
              Serviços
            </a>
            <a href="#como-funciona" className="hover:text-[#0F1D2E] transition-colors">
              Como funciona
            </a>
            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="hover:text-[#0F1D2E] transition-colors cursor-pointer"
            >
              Cadastrar empresa
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BookingModal
        key={bookingProvider?.id || 'booking-closed'}
        provider={bookingProvider}
        onClose={() => setBookingProvider(null)}
        onCreateLead={handleCreateLead}
      />

      <ProviderDetailModal
        key={detailProvider?.id || 'detail-closed'}
        provider={detailProvider}
        onClose={() => setDetailProviderId(null)}
        onBookWhatsapp={(p) => setBookingProvider(p)}
        onAddReview={handleAddReview}
        onDelete={
          detailProvider?.id.startsWith('custom-')
            ? (p) => handleDeleteProvider(p.id)
            : undefined
        }
      />

      <RegisterBusinessModal
        isOpen={isRegisterOpen}
        initialPlan={registerPlan}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterProvider={handleRegisterProvider}
      />
    </div>
  );
}

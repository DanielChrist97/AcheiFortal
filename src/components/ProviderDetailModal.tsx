import { useState, FormEvent } from 'react';
import {
  X,
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { ReviewItem, ServiceProvider } from '../types/directory';
import { ResilientImage } from './ResilientImage';
import { GoogleLogoMark, GoogleStarsRow } from './GoogleReviewsBadge';

interface ProviderDetailModalProps {
  provider: ServiceProvider | null;
  onClose: () => void;
  onBookWhatsapp: (provider: ServiceProvider) => void;
  onAddReview: (providerId: string, review: ReviewItem) => void;
  onDelete?: (provider: ServiceProvider) => void;
}

const AVATAR_COLORS = [
  'bg-[#1A73E8]',
  'bg-[#0B8457]',
  'bg-[#E37400]',
  'bg-[#7C3AED]',
  'bg-[#D93025]',
];

function getAvatarColor(name: string): string {
  const code = name.charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

export function ProviderDetailModal({
  provider,
  onClose,
  onBookWhatsapp,
  onAddReview,
  onDelete,
}: ProviderDetailModalProps) {
  const [author, setAuthor] = useState('');
  const [neighborhood, setNeighborhood] = useState('Aldeota');
  const [rating, setRating] = useState(5);
  const [serviceDone, setServiceDone] = useState('');
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [helpfulIds, setHelpfulIds] = useState<Record<string, boolean>>({});

  if (!provider) return null;

  const distribution: [number, number, number, number, number] =
    provider.ratingDistribution || [
      Math.max(1, provider.reviewCount),
      0,
      0,
      0,
      0,
    ];

  const totalDistCount =
    distribution[0] +
      distribution[1] +
      distribution[2] +
      distribution[3] +
      distribution[4] || 1;

  const toggleHelpful = (id: string) => {
    setHelpfulIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (author.trim().length < 2 || comment.trim().length < 6) return;

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      neighborhood: neighborhood.trim() || 'Fortaleza',
      rating,
      dateLabel: 'agora mesmo',
      serviceDone:
        serviceDone.trim() || provider.services[0]?.name || 'Atendimento realizado',
      comment: comment.trim(),
    };

    onAddReview(provider.id, newReview);
    setAuthor('');
    setServiceDone('');
    setComment('');
    setRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1D2E]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="provider-detail-title"
    >
      <div className="bg-white border border-[#E5E3DC] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-xl">
        <div className="relative h-52 sm:h-60 overflow-hidden rounded-t-2xl bg-[#F2F0EB]">
          <ResilientImage
            src={provider.imageUrl}
            alt={provider.imageAlt}
            title={provider.name}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes do estabelecimento"
            className="absolute top-4 right-4 p-2 bg-white/95 text-[#0F1D2E] hover:bg-white rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569]">
              <span>{provider.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{provider.neighborhood}</span>
              <span aria-hidden="true">·</span>
              <span>Verificado desde {provider.verifiedSince}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
              <h2
                id="provider-detail-title"
                className="font-display text-2xl font-bold text-[#0F1D2E]"
              >
                {provider.name}
              </h2>

              <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0F1D2E] tabular-nums shrink-0">
                <GoogleLogoMark className="w-4 h-4" />
                <span>{provider.rating.toFixed(1).replace('.', ',')}</span>
                <GoogleStarsRow rating={provider.rating} size="xs" />
                <span className="font-normal text-[#475569]">
                  ({provider.reviewCount})
                </span>
              </div>
            </div>

            <p className="text-sm text-[#334155] leading-relaxed mt-3">{provider.summary}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E3DC] text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#0B8457] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#0F1D2E]">{provider.address}</p>
                <p className="text-xs text-[#475569] mt-0.5">Atende: {provider.coverage}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#0B8457] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#0F1D2E]">{provider.hours}</p>
                <p className="text-xs text-[#475569] mt-0.5">
                  WhatsApp direto: {provider.whatsappDisplay}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-base font-bold text-[#0F1D2E] mb-3">
              Serviços oferecidos
            </h3>
            <div className="divide-y divide-[#E5E3DC] border border-[#E5E3DC] rounded-xl">
              {provider.services.map((srv) => (
                <div
                  key={srv.name}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                >
                  <p className="font-medium text-[#0F1D2E]">{srv.name}</p>
                  <span className="text-xs text-[#64748B] whitespace-nowrap">
                    Duração média: {srv.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Google-identical Reviews Summary & Histogram */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <GoogleLogoMark className="w-5 h-5" />
                <h3 className="font-display text-base font-bold text-[#0F1D2E]">
                  Avaliações no Google
                </h3>
              </div>

              {provider.googleMapsUrl && (
                <a
                  href={provider.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A73E8] hover:underline underline-offset-2"
                >
                  Abrir ficha no Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="p-4 sm:p-5 rounded-xl border border-[#E5E3DC] bg-[#FAF9F6] grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-4 flex flex-col items-start sm:items-center sm:text-center">
                <span className="font-display text-4xl font-bold text-[#0F1D2E] tabular-nums leading-none">
                  {provider.rating.toFixed(1).replace('.', ',')}
                </span>
                <div className="mt-2">
                  <GoogleStarsRow rating={provider.rating} size="sm" />
                </div>
                <span className="text-xs text-[#475569] mt-1.5 tabular-nums">
                  {provider.reviewCount} avaliações
                </span>
              </div>

              <div className="sm:col-span-8 space-y-1.5">
                {[5, 4, 3, 2, 1].map((starLabel, idx) => {
                  const count = distribution[idx] || 0;
                  const pct = Math.round((count / totalDistCount) * 100);
                  return (
                    <div
                      key={starLabel}
                      className="flex items-center gap-2.5 text-xs text-[#475569] tabular-nums"
                    >
                      <span className="w-3 text-right font-medium text-[#0F1D2E]">
                        {starLabel}
                      </span>
                      <div className="flex-1 h-2 bg-[#E5E3DC] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FBBC04] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Google-style Reviews */}
            <div className="divide-y divide-[#E5E3DC] border border-[#E5E3DC] rounded-xl bg-white">
              {provider.reviews.map((rev) => {
                const isHelpful = !!helpfulIds[rev.id];
                return (
                  <div key={rev.id} className="p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${getAvatarColor(
                            rev.author
                          )} text-white flex items-center justify-center text-sm font-semibold shrink-0`}
                          aria-hidden="true"
                        >
                          {rev.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0F1D2E] leading-tight">
                            {rev.author}
                          </p>
                          <p className="text-xs text-[#64748B] mt-0.5 tabular-nums">
                            {rev.localGuideCount
                              ? `Local Guide · ${rev.localGuideCount} avaliações · `
                              : ''}
                            {rev.neighborhood}
                          </p>
                        </div>
                      </div>
                      <GoogleLogoMark className="w-4 h-4 shrink-0 mt-0.5" />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#64748B]">
                      <GoogleStarsRow rating={rev.rating} size="xs" />
                      <span>{rev.dateLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rev.serviceDone}</span>
                    </div>

                    <p className="text-sm text-[#334155] leading-relaxed">{rev.comment}</p>

                    {rev.ownerReply && (
                      <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E5E3DC] text-xs space-y-1">
                        <p className="font-semibold text-[#0F1D2E]">
                          Resposta do proprietário
                        </p>
                        <p className="text-[#475569] leading-relaxed">{rev.ownerReply}</p>
                      </div>
                    )}

                    <div>
                      <button
                        type="button"
                        onClick={() => toggleHelpful(rev.id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          isHelpful
                            ? 'bg-[#E8F0FE] text-[#1A73E8]'
                            : 'text-[#64748B] hover:bg-[#F2F0EB] hover:text-[#0F1D2E]'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {isHelpful ? 'Útil (1)' : 'Útil'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleReviewSubmit}
              className="mt-4 p-4 rounded-xl border border-[#E5E3DC] bg-[#FAF9F6] space-y-3"
            >
              <p className="text-sm font-semibold text-[#0F1D2E]">
                Escrever uma avaliação
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="px-3 py-2 text-sm bg-white border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
                />
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Seu bairro"
                  className="px-3 py-2 text-sm bg-white border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
                />
                <select
                  aria-label="Nota da avaliação"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="px-3 py-2 text-sm bg-white border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
                >
                  <option value={5}>5 estrelas — Excelente</option>
                  <option value={4}>4 estrelas — Muito bom</option>
                  <option value={3}>3 estrelas — Regular</option>
                  <option value={2}>2 estrelas — Ruim</option>
                  <option value={1}>1 estrela — Péssimo</option>
                </select>
              </div>
              <input
                type="text"
                value={serviceDone}
                onChange={(e) => setServiceDone(e.target.value)}
                placeholder="Qual serviço realizou? (Ex: Higienização de ar-condicionado)"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
              />
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte como foi a pontualidade, preço e atendimento..."
                required
                className="w-full px-3 py-2 text-sm bg-white border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
              />
              <div className="flex items-center justify-between gap-3">
                {reviewSubmitted ? (
                  <span className="text-xs font-medium text-[#0B8457]">
                    Avaliação publicada com sucesso!
                  </span>
                ) : (
                  <span className="text-xs text-[#64748B]">
                    Sua nota atualiza a média geral do estabelecimento.
                  </span>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-[#0F1D2E] bg-[#EAE7DF] hover:bg-[#D6D3C9] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Publicar avaliação
                </button>
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-[#E5E3DC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm text-[#475569]">
                Orçamento e agendamento direto pelo WhatsApp
              </div>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(provider)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 hover:underline underline-offset-2 cursor-pointer whitespace-nowrap"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remover anúncio
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookWhatsapp(provider);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] text-sm font-semibold text-white bg-[#0B8457] hover:bg-[#096B46] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              Agendar pelo WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { MessageCircle, MapPin, Phone, Trash2 } from 'lucide-react';
import { ServiceProvider } from '../types/directory';
import { ResilientImage } from './ResilientImage';
import { GoogleLogoMark, GoogleStarsRow } from './GoogleReviewsBadge';

interface ProviderCardProps {
  provider: ServiceProvider;
  onBookWhatsapp: (provider: ServiceProvider) => void;
  onViewDetails: (provider: ServiceProvider) => void;
  onDelete?: (provider: ServiceProvider) => void;
}

export function ProviderCard({
  provider,
  onBookWhatsapp,
  onViewDetails,
  onDelete,
}: ProviderCardProps) {
  const cardBorderClass =
    provider.planTier === 'premium'
      ? 'border-[#0B8457]/50 hover:border-[#0B8457]'
      : provider.planTier === 'destaque'
        ? 'border-[#C9C5B9] hover:border-[#94A3B8]'
        : 'border-[#E5E3DC] hover:border-[#C9C5B9]';

  const tierText =
    provider.planTier === 'premium'
      ? 'Empresa Premium'
      : provider.planTier === 'destaque'
        ? 'Destaque'
        : null;

  return (
    <article
      className={`flex flex-col bg-white border rounded-xl overflow-hidden transition-colors ${cardBorderClass}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-[#F2F0EB]">
        <ResilientImage
          src={provider.imageUrl}
          alt={provider.imageAlt}
          title={provider.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2 text-xs text-[#475569]">
          <span className="truncate">
            {tierText && (
              <>
                <strong
                  className={
                    provider.planTier === 'premium'
                      ? 'font-semibold text-[#0B8457]'
                      : 'font-semibold text-[#0F1D2E]'
                  }
                >
                  {tierText}
                </strong>
                <span aria-hidden="true"> · </span>
              </>
            )}
            {provider.categoryLabel} · {provider.neighborhood} ·{' '}
            {provider.openNow ? 'Aberto agora' : 'Abre amanhã'}
          </span>
          <span className="tabular-nums shrink-0 text-[#0B8457] font-medium">
            ~{provider.responseTimeMinutes} min
          </span>
        </div>

        <h3 className="font-display text-lg font-bold text-[#0F1D2E] mt-2 leading-snug">
          <button
            type="button"
            onClick={() => onViewDetails(provider)}
            className="text-left hover:text-[#0B8457] transition-colors cursor-pointer"
          >
            {provider.name}
          </button>
        </h3>

        {/* Google-identical rating line */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2 text-sm tabular-nums">
          <GoogleLogoMark className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold text-[#0F1D2E]">
            {provider.rating.toFixed(1).replace('.', ',')}
          </span>
          <GoogleStarsRow rating={provider.rating} size="xs" />
          <button
            type="button"
            onClick={() => onViewDetails(provider)}
            className="text-[#475569] hover:text-[#0F1D2E] hover:underline underline-offset-2 cursor-pointer"
          >
            ({provider.reviewCount} no Google)
          </button>
        </div>

        <p className="text-sm text-[#475569] leading-relaxed mt-3 line-clamp-2">
          {provider.summary}
        </p>

        <div className="mt-4 pt-4 border-t border-[#F0EEE8] space-y-1.5 text-xs text-[#475569]">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0" aria-hidden="true" />
            <span className="truncate">{provider.address}</span>
          </div>
          <div className="flex items-center gap-2 tabular-nums">
            <Phone className="w-3.5 h-3.5 text-[#64748B] shrink-0" aria-hidden="true" />
            <span>WhatsApp direto: {provider.whatsappDisplay}</span>
          </div>
        </div>

        <div className="mt-auto pt-5 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onBookWhatsapp(provider)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] text-sm font-semibold text-white bg-[#0B8457] hover:bg-[#096B46] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            Agendar pelo WhatsApp
          </button>
          <button
            type="button"
            onClick={() => onViewDetails(provider)}
            className="px-3.5 py-2.5 min-h-[42px] text-sm font-medium text-[#0F1D2E] bg-[#F2F0EB] hover:bg-[#E5E3DC] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Avaliações
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(provider)}
              aria-label={`Remover anúncio ${provider.name}`}
              title="Remover anúncio"
              className="p-2.5 min-h-[42px] text-[#64748B] hover:text-red-700 bg-[#F2F0EB] hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

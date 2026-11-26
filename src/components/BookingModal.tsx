import { useState, useMemo, FormEvent } from 'react';
import { X, MessageCircle, ShieldCheck, Check, Copy, ExternalLink } from 'lucide-react';
import { BookingLead, ServiceProvider } from '../types/directory';
import { buildWhatsappUrl, FORTALEZA_NEIGHBORHOODS } from '../data/fortalezaProviders';

interface BookingModalProps {
  provider: ServiceProvider | null;
  onClose: () => void;
  onCreateLead: (lead: BookingLead) => void;
}

const TIME_WINDOWS = [
  'Hoje · Manhã (08h–12h)',
  'Hoje · Tarde (13h–18h)',
  'Amanhã · Manhã (08h–12h)',
  'Amanhã · Tarde (13h–18h)',
  'Combinar melhor horário no WhatsApp',
];

export function BookingModal({ provider, onClose, onCreateLead }: BookingModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientNeighborhood, setClientNeighborhood] = useState(
    provider?.neighborhood || 'Aldeota'
  );
  const [serviceRequested, setServiceRequested] = useState(
    provider?.services[0]?.name || 'Atendimento / Orçamento'
  );
  const [preferredWindow, setPreferredWindow] = useState(TIME_WINDOWS[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submittedLead, setSubmittedLead] = useState<BookingLead | null>(null);
  const [copied, setCopied] = useState(false);

  const neighborhoodsList = useMemo(
    () => FORTALEZA_NEIGHBORHOODS.filter((n) => n !== 'Todos os bairros'),
    []
  );

  if (!provider) return null;

  const formattedMessage = `Olá, *${provider.name}*! Encontrei vocês no *Achei Fortaleza* e gostaria de agendar:\n\n• *Cliente:* ${
    clientName.trim() || 'Cliente'
  }\n• *Bairro:* ${clientNeighborhood}\n• *Serviço:* ${serviceRequested}\n• *Preferência de horário:* ${preferredWindow}${
    notes.trim() ? `\n• *Observações:* ${notes.trim()}` : ''
  }\n\nPodemos confirmar o atendimento?`;

  const whatsappUrl = buildWhatsappUrl(provider.whatsapp, formattedMessage);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (clientName.trim().length < 2) {
      setError('Informe seu nome para o estabelecimento iniciar o atendimento.');
      return;
    }
    setError('');

    const newLead: BookingLead = {
      id: `lead-${Date.now()}`,
      providerId: provider.id,
      providerName: provider.name,
      providerCategory: provider.categoryLabel,
      providerWhatsapp: provider.whatsapp,
      clientName: clientName.trim(),
      clientNeighborhood,
      serviceRequested,
      preferredWindow,
      notes: notes.trim(),
      createdAtLabel: 'Agora mesmo',
      status: 'Novo pedido',
      whatsappUrl,
    };

    onCreateLead(newLead);
    setSubmittedLead(newLead);
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1D2E]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="bg-white border border-[#E5E3DC] rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-xl">
        <div className="flex items-start justify-between gap-4 p-6 border-b border-[#E5E3DC]">
          <div>
            <p className="text-xs font-medium text-[#475569]">
              Agendamento rápido · {provider.neighborhood} · Responde em ~{provider.responseTimeMinutes} min
            </p>
            <h2
              id="booking-modal-title"
              className="font-display text-xl font-bold text-[#0F1D2E] mt-1"
            >
              {provider.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de agendamento"
            className="p-2 text-[#475569] hover:text-[#0F1D2E] hover:bg-[#F2F0EB] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submittedLead ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="booking-client-name"
                  className="block text-sm font-medium text-[#0F1D2E] mb-1.5"
                >
                  Seu nome
                </label>
                <input
                  id="booking-client-name"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Mariana Costa"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0B8457] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="booking-neighborhood"
                  className="block text-sm font-medium text-[#0F1D2E] mb-1.5"
                >
                  Seu bairro em Fortaleza
                </label>
                <select
                  id="booking-neighborhood"
                  value={clientNeighborhood}
                  onChange={(e) => setClientNeighborhood(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457] focus:border-transparent"
                >
                  {neighborhoodsList.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="booking-service"
                className="block text-sm font-medium text-[#0F1D2E] mb-1.5"
              >
                Serviço desejado
              </label>
              <select
                id="booking-service"
                value={serviceRequested}
                onChange={(e) => setServiceRequested(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457] focus:border-transparent"
              >
                {provider.services.map((srv) => (
                  <option key={srv.name} value={srv.name}>
                    {srv.name}
                  </option>
                ))}
                <option value="Outro serviço / Solicitar orçamento">
                  Outro serviço / Solicitar orçamento
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="booking-window"
                className="block text-sm font-medium text-[#0F1D2E] mb-1.5"
              >
                Dia e turno preferido
              </label>
              <select
                id="booking-window"
                value={preferredWindow}
                onChange={(e) => setPreferredWindow(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457] focus:border-transparent"
              >
                {TIME_WINDOWS.map((win) => (
                  <option key={win} value={win}>
                    {win}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="booking-notes"
                className="block text-sm font-medium text-[#0F1D2E] mb-1.5"
              >
                Detalhes rápidos (opcional)
              </label>
              <textarea
                id="booking-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Apartamento no 4º andar, ou marca do veículo / equipamento..."
                className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0B8457] focus:border-transparent"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#F2F0EB] border border-[#E5E3DC]">
              <p className="text-xs font-semibold text-[#0F1D2E] mb-1">
                Prévia da mensagem para o WhatsApp {provider.whatsappDisplay}
              </p>
              <p className="text-xs text-[#475569] whitespace-pre-line leading-relaxed">
                {formattedMessage}
              </p>
            </div>

            {error && (
              <p className="text-sm font-medium text-red-700" role="alert">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <ShieldCheck className="w-4 h-4 text-[#0B8457] shrink-0" />
                <span>Contato direto sem intermediários</span>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-[#0B8457] hover:bg-[#096B46] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Confirmar e abrir WhatsApp
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-5">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]">
              <div className="p-1.5 rounded-lg bg-[#0B8457] text-white shrink-0 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F1D2E]">
                  Pedido enviado para {provider.name}
                </h3>
                <p className="text-sm text-[#334155] mt-1">
                  O estabelecimento já recebeu sua solicitação no painel de atendimento e você pode iniciar a conversa agora mesmo pelo WhatsApp.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-[#334155] border border-[#E5E3DC] rounded-xl p-4 bg-[#FAF9F6]">
              <div className="flex justify-between gap-4">
                <span className="text-[#64748B]">Cliente</span>
                <span className="font-medium text-[#0F1D2E]">
                  {submittedLead.clientName} ({submittedLead.clientNeighborhood})
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#64748B]">Serviço</span>
                <span className="font-medium text-[#0F1D2E] text-right">
                  {submittedLead.serviceRequested}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#64748B]">Janela escolhida</span>
                <span className="font-medium text-[#0F1D2E]">
                  {submittedLead.preferredWindow}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={submittedLead.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] text-sm font-semibold text-white bg-[#0B8457] hover:bg-[#096B46] rounded-lg transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                Abrir conversa no WhatsApp
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] text-sm font-medium text-[#0F1D2E] bg-[#F2F0EB] hover:bg-[#E5E3DC] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Mensagem copiada' : 'Copiar mensagem'}
              </button>
            </div>

            <div className="pt-2 border-t border-[#E5E3DC] flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-medium text-[#475569] hover:text-[#0F1D2E] px-3 py-1.5 cursor-pointer"
              >
                Voltar para os serviços
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

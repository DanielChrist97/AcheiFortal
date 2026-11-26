import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import {
  X,
  CheckCircle2,
  CreditCard,
  QrCode,
  Copy,
  Check,
  ArrowLeft,
  ShieldCheck,
  ImagePlus,
  Trash2,
} from 'lucide-react';
import { CategoryId, PlanTier, ServiceProvider } from '../types/directory';
import {
  BUSINESS_PLANS,
  CATEGORY_OPTIONS,
  FORTALEZA_NEIGHBORHOODS,
} from '../data/fortalezaProviders';

interface RegisterBusinessModalProps {
  isOpen: boolean;
  initialPlan?: PlanTier;
  onClose: () => void;
  onRegisterProvider: (provider: ServiceProvider) => void;
}

type ModalStep = 'details' | 'payment' | 'success';
type PaymentMethod = 'pix' | 'card';

export function RegisterBusinessModal({
  isOpen,
  initialPlan = 'destaque',
  onClose,
  onRegisterProvider,
}: RegisterBusinessModalProps) {
  const [step, setStep] = useState<ModalStep>('details');
  const [selectedPlanId, setSelectedPlanId] = useState<PlanTier>(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exclude<CategoryId, 'todos'>>('climatizacao');
  const [neighborhood, setNeighborhood] = useState('Aldeota');
  const [address, setAddress] = useState('');
  const [whatsappInput, setWhatsappInput] = useState('');
  const [homeService, setHomeService] = useState(true);
  const [summary, setSummary] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [error, setError] = useState('');

  // Card fields
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [pixCopied, setPixCopied] = useState(false);

  const [createdProvider, setCreatedProvider] = useState<ServiceProvider | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedPlanId(initialPlan);
      setStep('details');
      setError('');
    }
  }, [isOpen, initialPlan]);

  if (!isOpen) return null;

  const selectedPlan =
    BUSINESS_PLANS.find((p) => p.id === selectedPlanId) || BUSINESS_PLANS[0];

  const categories = CATEGORY_OPTIONS.filter(
    (c): c is { id: Exclude<CategoryId, 'todos'>; label: string } => c.id !== 'todos'
  );
  const neighborhoods = FORTALEZA_NEIGHBORHOODS.filter((n) => n !== 'Todos os bairros');

  const buildProviderObject = (): ServiceProvider => {
    const digits = whatsappInput.replace(/\D/g, '');
    const selectedCategory = categories.find((c) => c.id === category);
    const formattedPhone =
      digits.length === 11
        ? `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
        : whatsappInput;

    return {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      planTier: selectedPlanId,
      category,
      categoryLabel: selectedCategory?.label || 'Serviços',
      neighborhood,
      address: address.trim() || `Atendimento em ${neighborhood} · Fortaleza`,
      coverage:
        selectedPlanId === 'basico'
          ? `${neighborhood}, Fortaleza`
          : `${neighborhood} e bairros vizinhos em Fortaleza`,
      whatsapp: digits.startsWith('55') ? digits : `55${digits}`,
      whatsappDisplay: formattedPhone,
      rating: 5.0,
      reviewCount: 1,
      responseTimeMinutes: selectedPlanId === 'premium' ? 2 : 3,
      startingPrice: 'Sob consulta',
      openNow: true,
      homeService,
      verifiedSince: '2026',
      hours: 'Seg a Sáb · 08h00 às 18h00',
      summary: summary.trim(),
      imageUrl: photoDataUrl || undefined,
      imageAlt: `${name.trim()} — ${selectedCategory?.label} em ${neighborhood}, Fortaleza`,
      services: [
        {
          name: `Atendimento principal · ${selectedCategory?.label}`,
          priceFrom: 'Sob consulta',
          duration: '1h',
        },
        {
          name: 'Orçamento personalizado via WhatsApp',
          priceFrom: 'Sob consulta',
          duration: '15 min',
        },
      ],
      reviews: [
        {
          id: `rev-init-${Date.now()}`,
          author: 'Equipe Achei Fortaleza',
          neighborhood,
          rating: 5,
          dateLabel: 'Hoje',
          serviceDone: `Plano ${selectedPlan.name}`,
          comment: 'Estabelecimento ativo para receber agendamentos diretos pelo WhatsApp.',
        },
      ],
    };
  };

  const finalizeRegistration = () => {
    const newProvider = buildProviderObject();
    onRegisterProvider(newProvider);
    setCreatedProvider(newProvider);
    setStep('success');
  };

  const handleDetailsSubmit = (e: FormEvent) => {
    e.preventDefault();
    const digits = whatsappInput.replace(/\D/g, '');
    if (name.trim().length < 3) {
      setError('Informe o nome do profissional ou estabelecimento.');
      return;
    }
    if (digits.length < 10) {
      setError('Informe um número de WhatsApp válido com DDD (ex: 85 99999-0000).');
      return;
    }
    if (summary.trim().length < 10) {
      setError('Descreva brevemente os principais serviços oferecidos.');
      return;
    }

    setError('');
    if (selectedPlan.priceValue === 0) {
      finalizeRegistration();
    } else {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      const cardDigits = cardNumber.replace(/\D/g, '');
      if (cardHolder.trim().length < 3 || cardDigits.length < 13 || cardExpiry.length < 4 || cardCvv.length < 3) {
        setError('Preencha todos os dados do cartão para concluir a assinatura.');
        return;
      }
    }
    setError('');
    finalizeRegistration();
  };

  const pixPayload = `00020126580014BR.GOV.BCB.PIX0136acheifortaleza-planos-${selectedPlanId}@pix.ce.br5204000053039865405${selectedPlan.priceValue
    .toFixed(2)
    .replace('.', '')}5802BR5915ACHEI FORTALEZA6009FORTALEZA62070503***6304A1B2`;

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2000);
    } catch {
      setPixCopied(false);
    }
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Selecione um arquivo de imagem válido (JPG, PNG ou WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const rawResult = typeof reader.result === 'string' ? reader.result : '';
      if (!rawResult) return;

      const img = new Image();
      img.onload = () => {
        const maxWidth = 800;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setPhotoDataUrl(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          setPhotoDataUrl(rawResult);
        }
        setError('');
      };
      img.onerror = () => {
        setPhotoDataUrl(rawResult);
      };
      img.src = rawResult;
    };
    reader.readAsDataURL(file);
  };

  const handleResetAndClose = () => {
    setStep('details');
    setCreatedProvider(null);
    setName('');
    setAddress('');
    setWhatsappInput('');
    setSummary('');
    setPhotoDataUrl('');
    setCardHolder('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1D2E]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
    >
      <div className="bg-white border border-[#E5E3DC] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-xl">
        <div className="flex items-start justify-between gap-4 p-6 border-b border-[#E5E3DC]">
          <div>
            <p className="text-xs font-medium text-[#475569]">
              Achei Fortaleza · Cadastro empresarial e profissional
            </p>
            <h2
              id="register-modal-title"
              className="font-display text-xl font-bold text-[#0F1D2E] mt-1"
            >
              {step === 'details' && 'Escolha seu plano e cadastre seu negócio'}
              {step === 'payment' && `Pagamento · ${selectedPlan.name}`}
              {step === 'success' && 'Perfil publicado em Fortaleza'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Fechar cadastro de negócio"
            className="p-2 text-[#475569] hover:text-[#0F1D2E] hover:bg-[#F2F0EB] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="p-6 space-y-5">
            {/* 3-Tier Plan Selector */}
            <div>
              <p className="text-sm font-semibold text-[#0F1D2E] mb-2.5">
                Selecione o plano de exibição
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {BUSINESS_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#0B8457] bg-[#ECFDF5]/60 ring-1 ring-[#0B8457]'
                          : 'border-[#E5E3DC] bg-[#FAF9F6] hover:border-[#C9C5B9]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#0F1D2E]">
                          {plan.name}
                        </span>
                      </div>
                      <p className="font-display text-lg font-bold text-[#0F1D2E] mt-1 tabular-nums">
                        {plan.priceLabel}
                        {plan.priceValue > 0 && (
                          <span className="text-xs font-normal text-[#475569]">
                            {plan.billingCycle}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[#475569] mt-1 leading-snug">
                        {plan.id === 'basico' && 'Ordem padrão nas buscas'}
                        {plan.id === 'destaque' && 'Acima dos planos grátis'}
                        {plan.id === 'premium' && 'Topo absoluto e prioridade'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="reg-name"
                  className="block text-sm font-medium text-[#0F1D2E] mb-1.5"
                >
                  Nome do profissional ou empresa
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Vento Leste Climatização"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-category"
                  className="block text-sm font-medium text-[#0F1D2E] mb-1.5"
                >
                  Categoria
                </label>
                <select
                  id="reg-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as Exclude<CategoryId, 'todos'>)
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="reg-neighborhood"
                  className="block text-sm font-medium text-[#0F1D2E] mb-1.5"
                >
                  Bairro base
                </label>
                <select
                  id="reg-neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
                >
                  {neighborhoods.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="reg-whatsapp"
                  className="block text-sm font-medium text-[#0F1D2E] mb-1.5"
                >
                  WhatsApp para atendimento
                </label>
                <input
                  id="reg-whatsapp"
                  type="tel"
                  value={whatsappInput}
                  onChange={(e) => setWhatsappInput(e.target.value)}
                  placeholder="(85) 99999-0000"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-address"
                  className="block text-sm font-medium text-[#0F1D2E] mb-1.5"
                >
                  Endereço ou ponto de referência
                </label>
                <input
                  id="reg-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Av. Dom Luís, 500 · Aldeota"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="reg-summary"
                  className="block text-sm font-medium text-[#0F1D2E] mb-1.5"
                >
                  Serviços oferecidos
                </label>
                <textarea
                  id="reg-summary"
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Descreva o que você faz e o diferencial do seu atendimento..."
                  required
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
                />
              </div>

              <div className="sm:col-span-2">
                <span className="block text-sm font-medium text-[#0F1D2E] mb-1.5">
                  Foto do estabelecimento ou serviço
                </span>

                {!photoDataUrl ? (
                  <label
                    htmlFor="reg-photo"
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 rounded-xl border border-dashed border-[#C9C5B9] bg-[#FAF9F6] hover:border-[#0B8457] hover:bg-[#F2F0EB]/60 transition-colors cursor-pointer text-center sm:text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E3DC] flex items-center justify-center shrink-0 text-[#0B8457]">
                      <ImagePlus className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0F1D2E]">
                        Clique para escolher uma foto
                      </p>
                      <p className="text-xs text-[#64748B]">
                        JPG, PNG ou WebP · aparece no cartão do catálogo
                      </p>
                    </div>
                    <input
                      id="reg-photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="sr-only"
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-4 p-3 rounded-xl border border-[#E5E3DC] bg-[#FAF9F6]">
                    <img
                      src={photoDataUrl}
                      alt="Prévia da foto selecionada"
                      className="w-24 h-18 object-cover rounded-lg border border-[#E5E3DC] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F1D2E]">
                        Foto pronta para publicação
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <label
                          htmlFor="reg-photo-replace"
                          className="text-xs font-semibold text-[#0B8457] hover:underline underline-offset-2 cursor-pointer"
                        >
                          Trocar foto
                          <input
                            id="reg-photo-replace"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="sr-only"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setPhotoDataUrl('')}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-700 hover:underline underline-offset-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-[#334155] cursor-pointer">
              <input
                type="checkbox"
                checked={homeService}
                onChange={(e) => setHomeService(e.target.checked)}
                className="w-4 h-4 accent-[#0B8457] rounded"
              />
              <span>Realiza atendimento em domicílio em Fortaleza</span>
            </label>

            {error && (
              <p className="text-sm font-medium text-red-700" role="alert">
                {error}
              </p>
            )}

            <div className="pt-2 border-t border-[#E5E3DC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <p className="text-xs text-[#475569] tabular-nums">
                Plano escolhido:{' '}
                <strong className="text-[#0F1D2E]">
                  {selectedPlan.name} ({selectedPlan.priceLabel}
                  {selectedPlan.priceValue > 0 ? selectedPlan.billingCycle : ''})
                </strong>
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 text-sm font-medium text-[#475569] hover:text-[#0F1D2E] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-[#0B8457] hover:bg-[#096B46] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  {selectedPlan.priceValue === 0
                    ? 'Publicar cadastro grátis'
                    : `Ir para pagamento · ${selectedPlan.priceLabel}`}
                </button>
              </div>
            </div>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#475569]">
                  Anunciante: <strong className="text-[#0F1D2E]">{name}</strong> · {neighborhood}
                </p>
                <p className="font-display text-base font-bold text-[#0F1D2E] mt-0.5">
                  {selectedPlan.name}
                </p>
              </div>
              <div className="text-left sm:text-right tabular-nums">
                <p className="font-display text-xl font-bold text-[#0B8457]">
                  {selectedPlan.priceLabel}
                </p>
                <p className="text-xs text-[#64748B]">Cobrança mensal · cancele quando quiser</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#0F1D2E] mb-2">
                Forma de pagamento
              </p>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#EAE7DF] rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('pix');
                    setError('');
                  }}
                  className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'bg-white text-[#0F1D2E] shadow-sm'
                      : 'text-[#475569] hover:text-[#0F1D2E]'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  Pix imediato
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('card');
                    setError('');
                  }}
                  className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-white text-[#0F1D2E] shadow-sm'
                      : 'text-[#475569] hover:text-[#0F1D2E]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Cartão de crédito
                </button>
              </div>
            </div>

            {paymentMethod === 'pix' ? (
              <div className="p-5 rounded-xl border border-[#E5E3DC] bg-white space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div
                    className="w-28 h-28 rounded-xl border border-[#E5E3DC] bg-[#FAF9F6] flex flex-col items-center justify-center shrink-0 text-[#0F1D2E]"
                    aria-label="Código QR Pix"
                  >
                    <QrCode className="w-16 h-16 stroke-[1.5]" />
                    <span className="text-[11px] font-medium text-[#475569] mt-1 tabular-nums">
                      {selectedPlan.priceLabel}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-[#334155]">
                    <p className="font-semibold text-[#0F1D2E]">
                      Liberação imediata após o pagamento via Pix
                    </p>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Copie o código Pix abaixo, pague no app do seu banco e clique em confirmar para ativar seu perfil no topo do Achei Fortaleza.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        readOnly
                        value={pixPayload}
                        aria-label="Código Pix Copia e Cola"
                        className="flex-1 px-3 py-2 text-xs font-mono bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#475569]"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F1D2E] bg-[#F2F0EB] hover:bg-[#E5E3DC] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {pixCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#0B8457]" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copiar Pix
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl border border-[#E5E3DC] bg-white space-y-3">
                <div>
                  <label
                    htmlFor="card-holder"
                    className="block text-xs font-medium text-[#0F1D2E] mb-1"
                  >
                    Nome impresso no cartão
                  </label>
                  <input
                    id="card-holder"
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Como aparece no cartão"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="card-number"
                    className="block text-xs font-medium text-[#0F1D2E] mb-1"
                  >
                    Número do cartão
                  </label>
                  <input
                    id="card-number"
                    type="text"
                    inputMode="numeric"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="card-expiry"
                      className="block text-xs font-medium text-[#0F1D2E] mb-1"
                    >
                      Validade
                    </label>
                    <input
                      id="card-expiry"
                      type="text"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="card-cvv"
                      className="block text-xs font-medium text-[#0F1D2E] mb-1"
                    >
                      Código CVV
                    </label>
                    <input
                      id="card-cvv"
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D6D3C9] rounded-lg text-[#0F1D2E] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0B8457]"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm font-medium text-red-700" role="alert">
                {error}
              </p>
            )}

            <div className="pt-2 border-t border-[#E5E3DC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setStep('details');
                }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#475569] hover:text-[#0F1D2E] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar e editar dados
              </button>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#475569]">
                  <ShieldCheck className="w-4 h-4 text-[#0B8457]" />
                  Ativação imediata
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-[#0B8457] hover:bg-[#096B46] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  {paymentMethod === 'pix'
                    ? `Confirmar Pix (${selectedPlan.priceLabel})`
                    : `Pagar ${selectedPlan.priceLabel} e ativar`}
                </button>
              </div>
            </div>
          </form>
        )}

        {step === 'success' && createdProvider && (
          <div className="p-6 space-y-5">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]">
              <CheckCircle2 className="w-5 h-5 text-[#0B8457] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-[#0F1D2E]">
                  {createdProvider.name} está ativo no plano {selectedPlan.name}
                </h3>
                <p className="text-sm text-[#334155] mt-1">
                  {createdProvider.planTier === 'premium' &&
                    'Seu negócio já aparece no topo absoluto dos resultados em Fortaleza com identificação de Empresa Premium.'}
                  {createdProvider.planTier === 'destaque' &&
                    'Seu perfil já aparece com prioridade acima dos cadastros gratuitos e identificação de Destaque.'}
                  {createdProvider.planTier === 'basico' &&
                    'Seu cadastro gratuito já está disponível para moradores de Fortaleza entrarem em contato direto pelo WhatsApp.'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E3DC] text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Plano contratado</span>
                <span className="font-semibold text-[#0F1D2E] tabular-nums">
                  {selectedPlan.name} · {selectedPlan.priceLabel}
                  {selectedPlan.priceValue > 0 ? selectedPlan.billingCycle : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">WhatsApp conectado</span>
                <span className="font-medium text-[#0F1D2E] tabular-nums">
                  {createdProvider.whatsappDisplay}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-[#0B8457] hover:bg-[#096B46] rounded-lg transition-colors cursor-pointer"
              >
                Ver meu anúncio no catálogo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

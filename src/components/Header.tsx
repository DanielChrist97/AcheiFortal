import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onOpenRegister: () => void;
}

export function Header({ onOpenRegister }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E5E3DC]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        <a
          href="#"
          className="inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-[#0F1D2E] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B8457] rounded-sm"
        >
          <BrandLogo className="w-8 h-8 shrink-0" />
          <span>
            Achei <span className="text-[#0B8457]">Fortaleza</span>
          </span>
        </a>

        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#475569]"
        >
          <a
            href="#servicos"
            className="hover:text-[#0F1D2E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Serviços
          </a>
          <a
            href="#como-funciona"
            className="hover:text-[#0F1D2E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Como funciona
          </a>
          <a
            href="#avaliacoes"
            className="hover:text-[#0F1D2E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Avaliações
          </a>
          <a
            href="#para-empresas"
            className="hover:text-[#0F1D2E] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Para empresas
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenRegister}
            className="px-4 py-2 min-h-[40px] text-sm font-semibold text-white bg-[#0B8457] hover:bg-[#096B46] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B8457] focus-visible:ring-offset-2"
          >
            Cadastrar negócio
          </button>
        </div>
      </div>
    </header>
  );
}

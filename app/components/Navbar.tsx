import React, { useState, useRef, useEffect } from "react";
import {
  FolderOpen,
  Save,
  Info,
  LogOut,
  Move,
  RotateCw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  Sun,
  Activity,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  CircleDot,
  Layers,
  ChevronDown,
  Cpu,
  Binary,
} from "lucide-react";

export interface NavbarProps {
  // Arquivo
  onAbrirImagem: () => void;
  onSalvarImagem: () => void;
  onSobre: () => void;
  onSair: () => void;

  // Transformações Geométricas
  onTransladar: () => void;
  onRotacionar: () => void;
  onEspelhar: () => void;
  onRedimensionar: () => void;

  // Filtros
  onGrayscale: () => void;
  onPassaBaixa: () => void;
  onPassaAlta: () => void;
  onThreshold: () => void;

  // Morfologia Matemática
  onDilatacao: () => void;
  onErosao: () => void;
  onAbertura: () => void;
  onFechamento: () => void;
  onAfinamento: () => void;

  // Extração de Características
  onDesafio: () => void;
}

export function Navbar({
  onAbrirImagem,
  onSalvarImagem,
  onSobre,
  onSair,
  onTransladar,
  onRotacionar,
  onEspelhar,
  onRedimensionar,
  onGrayscale,
  onPassaBaixa,
  onPassaAlta,
  onThreshold,
  onDilatacao,
  onErosao,
  onAbertura,
  onFechamento,
  onAfinamento,
  onDesafio,
}: NavbarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Fecha o dropdown ao clicar fora do componente de navegação
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleMenuClick = (menuName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleMenuHover = (menuName: string) => {
    // Se algum menu já estiver aberto, alternar ao passar o mouse por cima
    if (activeMenu !== null) {
      setActiveMenu(menuName);
    }
  };

  const handleItemClick = (callback: () => void, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(null);
    callback();
  };

  return (
    <nav
      ref={navRef}
      className="bg-slate-900 border-b border-slate-800 text-slate-200 px-4 py-1.5 select-none relative z-50 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-1.5">
        {/* ========================================================================= */}
        {/* 1. MENU ARQUIVO */}
        {/* ========================================================================= */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={(e) => handleMenuClick("arquivo", e)}
            onMouseEnter={() => handleMenuHover("arquivo")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              activeMenu === "arquivo"
                ? "bg-indigo-600 text-white"
                : "text-slate-200 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>Arquivo</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-75" />
          </button>

          {activeMenu === "arquivo" && (
            <div className="absolute left-0 top-full mt-1.5 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 text-xs sm:text-sm z-50">
              <button
                type="button"
                onClick={(e) => handleItemClick(onAbrirImagem, e)}
                className="w-full px-3.5 py-2 text-left flex items-center justify-between text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <FolderOpen className="w-4 h-4 text-indigo-400" />
                  Abrir imagem
                </span>
                <span className="text-[11px] text-slate-400">Ctrl+O</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleItemClick(onSalvarImagem, e)}
                className="w-full px-3.5 py-2 text-left flex items-center justify-between text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Save className="w-4 h-4 text-emerald-400" />
                  Salvar imagem
                </span>
                <span className="text-[11px] text-slate-400">Ctrl+S</span>
              </button>

              <div className="my-1 border-t border-slate-800" />

              <button
                type="button"
                onClick={(e) => handleItemClick(onSobre, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <Info className="w-4 h-4 text-sky-400" />
                Sobre
              </button>

              <button
                type="button"
                onClick={(e) => handleItemClick(onSair, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. MENU TRANSFORMAÇÕES GEOMÉTRICAS */}
        {/* ========================================================================= */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={(e) => handleMenuClick("geometricas", e)}
            onMouseEnter={() => handleMenuHover("geometricas")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              activeMenu === "geometricas"
                ? "bg-indigo-600 text-white"
                : "text-slate-200 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>Transformações Geométricas</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-75" />
          </button>

          {activeMenu === "geometricas" && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 text-xs sm:text-sm z-50">
              <button
                type="button"
                onClick={(e) => handleItemClick(onTransladar, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <Move className="w-4 h-4 text-amber-400" />
                Transladar
              </button>

              <button
                type="button"
                onClick={(e) => handleItemClick(onRotacionar, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-amber-400" />
                Rotacionar
              </button>

              <button
                type="button"
                onClick={(e) => handleItemClick(onEspelhar, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <FlipHorizontal className="w-4 h-4 text-amber-400" />
                Espelhar
              </button>

              <div className="my-1 border-t border-slate-800" />

              <button
                type="button"
                onClick={(e) => handleItemClick(onRedimensionar, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4 text-amber-400" />
                Redimensionar
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 3. MENU FILTROS */}
        {/* ========================================================================= */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={(e) => handleMenuClick("filtros", e)}
            onMouseEnter={() => handleMenuHover("filtros")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              activeMenu === "filtros"
                ? "bg-indigo-600 text-white"
                : "text-slate-200 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>Filtros</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-75" />
          </button>

          {activeMenu === "filtros" && (
            <div className="absolute left-0 top-full mt-1.5 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 text-xs sm:text-sm z-50">
              <button
                type="button"
                onClick={(e) => handleItemClick(onGrayscale, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <Sun className="w-4 h-4 text-cyan-400" />
                Grayscale
              </button>

              <button
                type="button"
                onClick={(e) => handleItemClick(onPassaBaixa, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                Passa Baixa
              </button>

              <button
                type="button"
                onClick={(e) => handleItemClick(onPassaAlta, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <Activity className="w-4 h-4 text-cyan-400 rotate-180" />
                Passa Alta
              </button>

              <button
                type="button"
                onClick={(e) => handleItemClick(onThreshold, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                Threshold
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 4. MENU MORFOLOGIA MATEMÁTICA */}
        {/* ========================================================================= */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={(e) => handleMenuClick("morfologia", e)}
            onMouseEnter={() => handleMenuHover("morfologia")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              activeMenu === "morfologia"
                ? "bg-indigo-600 text-white"
                : "text-slate-200 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>Morfologia Matemática</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-75" />
          </button>

          {activeMenu === "morfologia" && (
            <div className="absolute left-0 top-full mt-1.5 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 text-xs sm:text-sm z-50">
              <button
                type="button"
                onClick={(e) => handleItemClick(onDilatacao, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <Maximize2 className="w-4 h-4 text-fuchsia-400" />
                Dilatação
              </button>

              <button
                type="button"
                onClick={(e) => handleItemClick(onErosao, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4 text-fuchsia-400" />
                Erosão
              </button>

              <div className="my-1 border-t border-slate-800" />

              <button
                type="button"
                onClick={(e) => handleItemClick(onAbertura, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <CircleDot className="w-4 h-4 text-fuchsia-400" />
                Abertura
              </button>

              <button
                type="button"
                onClick={(e) => handleItemClick(onFechamento, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4 text-fuchsia-400" />
                Fechamento
              </button>

              <button
                type="button"
                onClick={(e) => handleItemClick(onAfinamento, e)}
                className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <Binary className="w-4 h-4 text-fuchsia-400" />
                Afinamento
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 5. MENU EXTRAÇÃO DE CARACTERÍSTICAS */}
        {/* ========================================================================= */}
        <div className="relative inline-block">
          <button
            type="button"
            onClick={(e) => handleMenuClick("extracao", e)}
            onMouseEnter={() => handleMenuHover("extracao")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              activeMenu === "extracao"
                ? "bg-indigo-600 text-white"
                : "text-slate-200 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>Extração de Características</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-75" />
          </button>

          {activeMenu === "extracao" && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 text-xs sm:text-sm z-50">
              <button
                type="button"
                onClick={(e) => handleItemClick(onDesafio, e)}
                className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 text-amber-300 hover:bg-indigo-600 hover:text-white transition-colors font-medium cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-amber-400" />
                DESAFIO
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

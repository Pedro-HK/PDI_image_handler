import React from "react";
import { X, Info, Sparkles, BookOpen } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorName?: string;
}

export function AboutModal({
  isOpen,
  onClose,
  authorName = "Pedro Henrique Knorst",
}: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2 text-indigo-400">
            <Info className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">Sobre o Projeto</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4 text-sm text-slate-300">
          <div>
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Manipulador de Imagens - PDI
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Trabalho prático da disciplina de Processamento Digital de Imagens - Universidade Feevale.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3.5 space-y-1">
            <span className="text-xs uppercase font-semibold text-indigo-300 tracking-wider">
              Autor
            </span>
            <div className="pt-1">
              <span className="bg-slate-700/80 text-white font-medium px-3 py-1 rounded-md text-xs border border-slate-600/70 inline-block">
                {authorName}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Menus e Estrutura
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <li className="bg-slate-950/40 p-2 rounded border border-slate-800">
                <strong className="text-slate-200">Arquivo:</strong> Abrir, Salvar, Sobre, Sair.
              </li>
              <li className="bg-slate-950/40 p-2 rounded border border-slate-800">
                <strong className="text-slate-200">Geométricas:</strong> Transladar, Rotacionar, Espelhar, Aumentar, Diminuir.
              </li>
              <li className="bg-slate-950/40 p-2 rounded border border-slate-800">
                <strong className="text-slate-200">Filtros:</strong> Grayscale, Passa Baixa, Passa Alta, Threshold.
              </li>
              <li className="bg-slate-950/40 p-2 rounded border border-slate-800">
                <strong className="text-slate-200">Morfologia:</strong> Dilatação, Erosão, Abertura, Fechamento, Afinamento.
              </li>
              <li className="col-span-2 bg-slate-950/40 p-2 rounded border border-slate-800">
                <strong className="text-amber-300">Extração de Características:</strong> DESAFIO.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

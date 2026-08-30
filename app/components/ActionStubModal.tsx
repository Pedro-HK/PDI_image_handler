import React from "react";
import { X, Code, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { PDI_OPERATIONS, type PDIOperationInfo } from "../utils/pdiOperations";

interface ActionStubModalProps {
  operationId: string | null;
  onClose: () => void;
  hasImage: boolean;
}

export function ActionStubModal({
  operationId,
  onClose,
  hasImage,
}: ActionStubModalProps) {
  if (!operationId) return null;

  const operation: PDIOperationInfo | undefined = PDI_OPERATIONS[operationId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">
              {operation ? operation.name : "Operação PDI"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 text-sm text-slate-300">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
              Categoria: {operation?.category.toUpperCase()}
            </span>
            <p className="text-slate-200 mt-1">
              {operation?.description || "Técnica selecionada no menu."}
            </p>
          </div>

          {!hasImage ? (
            <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-3 flex items-start gap-3 text-amber-200 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Atenção:</strong> Nenhuma imagem está carregada no momento. Abra uma imagem primeiro pelo menu <em>Arquivo &gt; Abrir imagem</em>.
              </span>
            </div>
          ) : (
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-3 flex items-start gap-3 text-emerald-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Imagem carregada pronta para receber as transformações no próximo encontro.
              </span>
            </div>
          )}

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono text-indigo-300">
                <Code className="w-3.5 h-3.5" />
                Local para implementação:
              </span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono text-slate-300">
                app/utils/pdiOperations.ts
              </span>
            </div>
            <p className="text-xs text-slate-400">
              O gancho da interface para a ação <code>{operationId}</code> já está configurado. Apenas adicione os cálculos de matriz de pixels na função correspondente quando desejar.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}


import React from "react";
import { BaseModal } from "../BaseModal";

interface AumentarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (sizex: number, sizey: number) => void;
}

export function RedimensionarModal({
  isOpen,
  onClose,
  onApply,
}: AumentarModalProps) {
  const [sizex, setSizex] = React.useState<number>(1);
  const [sizey, setSizey] = React.useState<number>(1);

  const handleConfirm = () => {
    onApply(sizex, sizey);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Redimensionar Imagem"
      subtitle="Transformações Geométricas"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Deslocamento X
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={sizex}
              onChange={(e) => setSizex(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Ex: 100"
            />
            <span className="text-xs text-slate-400">px</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Deslocamento Y
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={sizey}
              onChange={(e) => setSizey(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Ex: 50"
            />
            <span className="text-xs text-slate-400">px</span>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}


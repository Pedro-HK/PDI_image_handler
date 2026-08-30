import React, { useState } from "react";
import { BaseModal } from "../BaseModal";

interface TransladarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (dx: number, dy: number) => void;
}

export function TransladarModal({
  isOpen,
  onClose,
  onApply,
}: TransladarModalProps) {
  const [dx, setDx] = useState<number>(100);
  const [dy, setDy] = useState<number>(50);

  const handleConfirm = () => {
    onApply(dx, dy);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Transladar Imagem"
      subtitle="Transformações Geométricas"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Deslocamento X (dx)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={dx}
              onChange={(e) => setDx(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Ex: 100"
            />
            <span className="text-xs text-slate-400">px</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Deslocamento Y (dy)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={dy}
              onChange={(e) => setDy(Number(e.target.value))}
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


import React, { useState } from "react";
import { BaseModal } from "../BaseModal";

interface BrightnessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (brightness: number) => void;
}

export function BrightnessModal({
  isOpen,
  onClose,
  onApply,
}: BrightnessModalProps) {
  const [brightness, setBrightness] = useState<number>(0);

  const handleConfirm = () => {
    onApply(brightness);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Ajustar Brilho"
      subtitle="Filtros"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Brilho
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={brightness}
            onChange={(event) => setBrightness(Number(event.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Ex: 20"
          />
          <span className="text-xs text-slate-400">%</span>
        </div>
      </div>
    </BaseModal>
  );
}
import React from "react";
import { BaseModal } from "../BaseModal";

interface ThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (limiar: number) => void;
}

export function ThresholdModal({
  isOpen,
  onClose,
  onApply,
}: ThresholdModalProps) {
  const [limiar, setLimiar] = React.useState<number>(128);

  const handleConfirm = () => {
    onApply(limiar);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Filtro Threshold (Limiarização)"
      subtitle="Filtros"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Limiar: <span className="text-indigo-400">{limiar}</span>
          </label>
          <input
            type="range"
            min="0"
            max="255"
            value={limiar}
            onChange={(event) => setLimiar(Number(event.target.value))}
            className="w-full accent-indigo-500"
          />
          <input
            type="number"
            min="0"
            max="255"
            value={limiar}
            onChange={(event) =>
              setLimiar(Math.min(255, Math.max(0, Number(event.target.value))))
            }
            className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Ex: 128"
          />
          <p className="mt-2 text-xs text-slate-500">
            Pixels com intensidade acima do limiar ficam brancos (255); os
            demais ficam pretos (0).
          </p>
        </div>
      </div>
    </BaseModal>
  );
}

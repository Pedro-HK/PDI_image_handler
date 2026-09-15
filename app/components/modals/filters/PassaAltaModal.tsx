import React from "react";
import { BaseModal } from "../BaseModal";

interface PassaAltaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (methodType: "sobel" | "robinson", threshold: number) => void;
}

export function PassaAltaModal({
  isOpen,
  onClose,
  onApply,
}: PassaAltaModalProps) {
  const [methodType, setMethodType] = React.useState<"sobel" | "robinson">(
    "sobel",
  );
  const [threshold, setThreshold] = React.useState<number>(128);

  const handleConfirm = () => {
    onApply(methodType, threshold);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Filtro Passa Alta"
      subtitle="Filtros"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Método
          </label>
          <select
            value={methodType}
            onChange={(event) =>
              setMethodType(event.target.value as "sobel" | "robinson")
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="sobel">Sobel</option>
            <option value="robinson">Robinson</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Limiar
          </label>
          <input
            type="number"
            min="0"
            max="255"
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Ex: 128"
          />
        </div>
      </div>
    </BaseModal>
  );
}


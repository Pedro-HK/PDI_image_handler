import React from "react";
import { BaseModal } from "../BaseModal";

interface PassaBaixaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (methodType: "gaussian" | "average") => void;
}

export function PassaBaixaModal({
  isOpen,
  onClose,
  onApply,
}: PassaBaixaModalProps) {
  const [methodType, setMethodType] = React.useState<"gaussian" | "average">(
    "gaussian",
  );

  const handleConfirm = () => {
    onApply(methodType);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Filtro Passa Baixa"
      subtitle="Filtros"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Método
        </label>
        <select
          value={methodType}
          onChange={(event) =>
            setMethodType(event.target.value as "gaussian" | "average")
          }
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="gaussian">Gaussiano</option>
          <option value="average">Média</option>
        </select>
      </div>
    </BaseModal>
  );
}


import React from "react";
import { BaseModal } from "../BaseModal";

interface FechamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function FechamentoModal({
  isOpen,
  onClose,
  onApply,
}: FechamentoModalProps) {
  const handleConfirm = () => {
    onApply();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Fechamento"
      subtitle="Morfologia Matemática"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        {/* TODO: Adicione os campos de fechamento aqui */}
        <p className="italic text-slate-500">Parâmetros de fechamento (adicione os campos aqui).</p>
      </div>
    </BaseModal>
  );
}


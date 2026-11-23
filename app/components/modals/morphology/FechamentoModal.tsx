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
        <p className="italic text-slate-500">Tem certeza que deseja aplicar o fechamento na imagem?</p>
      </div>
    </BaseModal>
  );
}


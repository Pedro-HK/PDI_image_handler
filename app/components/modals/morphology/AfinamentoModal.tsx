import React from "react";
import { BaseModal } from "../BaseModal";

interface AfinamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function AfinamentoModal({
  isOpen,
  onClose,
  onApply,
}: AfinamentoModalProps) {
  const handleConfirm = () => {
    onApply();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Afinamento"
      subtitle="Morfologia Matemática"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        {/* TODO: Adicione os campos de afinamento aqui */}
        <p className="italic text-slate-500">Parâmetros de afinamento (adicione os campos aqui).</p>
      </div>
    </BaseModal>
  );
}


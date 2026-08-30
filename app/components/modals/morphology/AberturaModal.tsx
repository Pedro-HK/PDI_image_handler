import React from "react";
import { BaseModal } from "../BaseModal";

interface AberturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function AberturaModal({
  isOpen,
  onClose,
  onApply,
}: AberturaModalProps) {
  const handleConfirm = () => {
    onApply();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Abertura"
      subtitle="Morfologia Matemática"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        {/* TODO: Adicione os campos de abertura aqui */}
        <p className="italic text-slate-500">Parâmetros de abertura (adicione os campos aqui).</p>
      </div>
    </BaseModal>
  );
}


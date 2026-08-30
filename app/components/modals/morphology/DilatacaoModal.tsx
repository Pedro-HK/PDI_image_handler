import React from "react";
import { BaseModal } from "../BaseModal";

interface DilatacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function DilatacaoModal({
  isOpen,
  onClose,
  onApply,
}: DilatacaoModalProps) {
  const handleConfirm = () => {
    onApply();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Dilatação"
      subtitle="Morfologia Matemática"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        {/* TODO: Adicione os campos de dilatação aqui */}
        <p className="italic text-slate-500">Parâmetros de dilatação (adicione os campos aqui).</p>
      </div>
    </BaseModal>
  );
}


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
        <p className="italic text-slate-500">Tem certeza que deseja aplicar a abertura na imagem?</p>
      </div>
    </BaseModal>
  );
}


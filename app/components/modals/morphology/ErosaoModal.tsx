import React from "react";
import { BaseModal } from "../BaseModal";

interface ErosaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function ErosaoModal({
  isOpen,
  onClose,
  onApply,
}: ErosaoModalProps) {
  const handleConfirm = () => {
    onApply();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Erosão"
      subtitle="Morfologia Matemática"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        <p className="italic text-slate-500">Tem certeza que deseja erosão a imagem?</p>
      </div>
    </BaseModal>
  );
}


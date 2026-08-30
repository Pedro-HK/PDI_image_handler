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
        {/* TODO: Adicione os campos de erosão aqui */}
        <p className="italic text-slate-500">Parâmetros de erosão (adicione os campos aqui).</p>
      </div>
    </BaseModal>
  );
}


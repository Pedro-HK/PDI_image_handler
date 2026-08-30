import React from "react";
import { BaseModal } from "../BaseModal";

interface RotacionarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function RotacionarModal({
  isOpen,
  onClose,
  onApply,
}: RotacionarModalProps) {
  const handleConfirm = () => {
    onApply();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Rotacionar Imagem"
      subtitle="Transformações Geométricas"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        {/* TODO: Adicione os campos de rotação aqui */}
        <p className="italic text-slate-500">Parâmetros de rotação (adicione os campos aqui).</p>
      </div>
    </BaseModal>
  );
}


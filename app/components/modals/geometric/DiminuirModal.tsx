import React from "react";
import { BaseModal } from "../BaseModal";

interface DiminuirModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function DiminuirModal({
  isOpen,
  onClose,
  onApply,
}: DiminuirModalProps) {
  const handleConfirm = () => {
    onApply();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Diminuir Imagem (Escala Down)"
      subtitle="Transformações Geométricas"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        {/* TODO: Adicione os campos de redução aqui */}
        <p className="italic text-slate-500">Parâmetros de redução (adicione os campos aqui).</p>
      </div>
    </BaseModal>
  );
}


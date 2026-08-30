import React from "react";
import { BaseModal } from "../BaseModal";

interface AumentarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function AumentarModal({
  isOpen,
  onClose,
  onApply,
}: AumentarModalProps) {
  const handleConfirm = () => {
    onApply();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Aumentar Imagem (Escala Up)"
      subtitle="Transformações Geométricas"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        {/* TODO: Adicione os campos de ampliação aqui */}
        <p className="italic text-slate-500">Parâmetros de ampliação (adicione os campos aqui).</p>
      </div>
    </BaseModal>
  );
}


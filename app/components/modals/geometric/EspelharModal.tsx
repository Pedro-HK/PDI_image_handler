import React from "react";
import { BaseModal } from "../BaseModal";

interface EspelharModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function EspelharModal({
  isOpen,
  onClose,
  onApply,
}: EspelharModalProps) {
  const handleConfirm = () => {
    onApply();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Espelhar Imagem"
      subtitle="Transformações Geométricas"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        {/* TODO: Adicione os campos de espelhamento aqui */}
        <p className="italic text-slate-500">Parâmetros de espelhamento (adicione os campos aqui).</p>
      </div>
    </BaseModal>
  );
}


import React from "react";
import { BaseModal } from "../BaseModal";

interface GrayscaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function GrayscaleModal({
  isOpen,
  onClose,
  onApply,
}: GrayscaleModalProps) {
  const handleConfirm = () => {
    onApply();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Filtro Grayscale (Escala de Cinza)"
      subtitle="Filtros"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        {/* TODO: Adicione os campos de escala de cinza aqui */}
        <p className="italic text-slate-500">Parâmetros de escala de cinza (adicione os campos aqui).</p>
      </div>
    </BaseModal>
  );
}


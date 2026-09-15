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
    />
  );
}


import React from "react";
import { BaseModal } from "../BaseModal";

interface PassaAltaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function PassaAltaModal({
  isOpen,
  onClose,
  onApply,
}: PassaAltaModalProps) {
  const handleConfirm = () => {
    onApply();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Filtro Passa Alta"
      subtitle="Filtros"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        {/* TODO: Adicione os campos de passa alta aqui */}
        <p className="italic text-slate-500">Parâmetros do filtro passa alta (adicione os campos aqui).</p>
      </div>
    </BaseModal>
  );
}


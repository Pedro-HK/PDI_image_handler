import React from "react";
import { BaseModal } from "../BaseModal";

interface PassaBaixaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function PassaBaixaModal({
  isOpen,
  onClose,
  onApply,
}: PassaBaixaModalProps) {
  const handleConfirm = () => {
    onApply();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Filtro Passa Baixa"
      subtitle="Filtros"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        {/* TODO: Adicione os campos de passa baixa aqui */}
        <p className="italic text-slate-500">Parâmetros do filtro passa baixa (adicione os campos aqui).</p>
      </div>
    </BaseModal>
  );
}


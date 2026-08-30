import React from "react";
import { BaseModal } from "../BaseModal";

interface ThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function ThresholdModal({
  isOpen,
  onClose,
  onApply,
}: ThresholdModalProps) {
  const handleConfirm = () => {
    onApply();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="Filtro Threshold (Limiarização)"
      subtitle="Filtros"
      onClose={onClose}
      onApply={handleConfirm}
    >
      <div className="py-2 text-xs text-slate-400">
        {/* TODO: Adicione os campos de threshold aqui */}
        <p className="italic text-slate-500">Parâmetros de threshold (adicione os campos aqui).</p>
      </div>
    </BaseModal>
  );
}


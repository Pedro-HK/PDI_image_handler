import React from "react";
import { BaseModal } from "../BaseModal";

interface RotacionarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (angle: number) => void;
}

export function RotacionarModal({
  isOpen,
  onClose,
  onApply,
}: RotacionarModalProps) {
  const [angle, setAngle] = React.useState<number>(0);

  const handleAngleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAngle(Number(event.target.value));
  };

  const handleConfirm = () => {
    onApply(angle);
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
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Ângulo de Rotação
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={angle}
              onChange={handleAngleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Ex: 45"
            />
            <span className="text-xs text-slate-400">°</span>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

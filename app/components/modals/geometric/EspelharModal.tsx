import React from "react";
import { BaseModal } from "../BaseModal";

interface EspelharModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (axis: "horizontal" | "vertical") => void;
}

export function EspelharModal({
  isOpen,
  onClose,
  onApply,
}: EspelharModalProps) {
  const [axis, setAxis] = React.useState<"horizontal" | "vertical">(
    "horizontal",
  );

  const handleAxisChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAxis = event.target.value as "horizontal" | "vertical";
    setAxis(selectedAxis);
  };

  const handleConfirm = () => {
    onApply(axis);
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
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Espelhar Eixo:
          </label>
          <div className="flex items-center gap-2">
            <select
              value={axis}
              onChange={handleAxisChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

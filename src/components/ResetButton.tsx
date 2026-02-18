'use client';

import { useState } from 'react';

interface ResetButtonProps {
  onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    onReset();
    setShowConfirm(false);
  };

  return (
    <div className="fixed bottom-4 right-4">
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="
            px-3 py-2 text-sm text-gray-400
            hover:text-gray-600 hover:bg-gray-100
            rounded-lg transition-colors cursor-pointer
          "
          aria-label="Reiniciar progreso"
        >
          Reiniciar
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg flex flex-col gap-3">
          <p className="text-sm text-gray-600">
            ¿Borrar todo el progreso?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="
                px-3 py-2 text-sm font-medium
                bg-gray-100 text-gray-600 rounded-lg
                hover:bg-gray-200 transition-colors cursor-pointer
              "
            >
              Cancelar
            </button>
            <button
              onClick={handleReset}
              className="
                px-3 py-2 text-sm font-medium
                bg-red-500 text-white rounded-lg
                hover:bg-red-600 transition-colors cursor-pointer
              "
            >
              Sí, borrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

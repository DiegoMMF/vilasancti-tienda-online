"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDiscount } from "lib/hooks/use-discount";
import { useEffect, useState } from "react";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDiscountActive, discountPercentage } = useDiscount();

  useEffect(() => {
    // Solo mostrar el modal si hay descuento activo
    if (!isDiscountActive) return;

    // Verificar si es la primera visita del usuario
    // const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    // if (!hasSeenWelcome) {
    // Mostrar el modal después de 2 segundos
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
    // }
  }, [isDiscountActive]);

  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenWelcome", "true");
  };

  if (!isOpen || !isDiscountActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all duration-300">
        <div className="absolute top-4 right-4">
          <button
            onClick={closeModal}
            className="rounded-full p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#bf9d6d]/10 mb-4">
            <span className="text-3xl">💝</span>
          </div>

          <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-3 font-cormorant">
            Obsequio Lanzamiento
          </h3>

          <div className="mt-4 space-y-3">
            <p className="text-base text-gray-700 font-inter leading-relaxed">
              Un {discountPercentage}% de obsequio en tu compra para celebrar el
              inicio de una marca pensada para tu confort y distinción.
            </p>
            <p className="text-xs text-gray-500 font-inter">
              El obsequio se aplica automáticamente en el carrito.
            </p>
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="inline-flex justify-center rounded-full bg-[#bf9d6d] px-12 py-4 text-sm font-medium text-white hover:bg-[#a88a5a] transition-colors font-inter shadow-lg hover:shadow-xl"
              onClick={closeModal}
            >
              Descubrir la Colección
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

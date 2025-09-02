"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar si es la primera visita del usuario
    // const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    // if (!hasSeenWelcome) {
      // Mostrar el modal después de 2 segundos
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    // }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenWelcome", "true");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                  
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-gray-900 mb-3 font-cormorant"
                  >
                    Obsequio Lanzamiento
                  </Dialog.Title>
                  
                  <div className="mt-4 space-y-3">
                    <p className="text-base text-gray-700 font-inter leading-relaxed">
                      Un 10% de obsequio en tu compra para celebrar el inicio de una marca pensada para tu confort y distinción.
                    </p>
                    <p className="text-xs text-gray-500 font-inter">
                      El obsequio se aplica automáticamente en el carrito.
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-full bg-[#bf9d6d] px-8 py-3 text-sm font-medium text-white hover:bg-[#a88a5a] transition-colors font-inter shadow-lg hover:shadow-xl"
                      onClick={closeModal}
                    >
                      Descubrir la Colección
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export default function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  altText,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: ImageModalProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsLoaded(false);
      setScale(1); // Reset zoom when opening
      setPosition({ x: 0, y: 0 }); // Reset position when opening
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrevious && onPrevious) {
        onPrevious();
      } else if (e.key === "ArrowRight" && hasNext && onNext) {
        onNext();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onPrevious, onNext, hasPrevious, hasNext]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
    // Reset position when zooming out to fit
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const buttonClassName =
    "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] hover:no-underline rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop con efecto de desenfoque */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Contenedor del modal sin bordes */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {/* Header con controles */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#bf9d6d]/20 bg-[#f0e3d7]/50 text-[#bf9d6d] backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:text-[#f0e3d7] hover:bg-[#bf9d6d]"
            aria-label="Cerrar imagen"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>

          {/* Controles de zoom - ocultos en mobile */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#bf9d6d]/20 bg-[#f0e3d7]/50 text-[#bf9d6d] backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Reducir zoom"
            >
              <MagnifyingGlassMinusIcon className="h-5 w-5" />
            </button>
            <span className="text-sm text-[#bf9d6d] font-medium px-2">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 3}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#bf9d6d]/20 bg-[#f0e3d7]/50 text-[#bf9d6d] backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Aumentar zoom"
            >
              <MagnifyingGlassPlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Imagen con zoom y pan */}
        <div
          className="relative max-w-full max-h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className={`transition-all duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transformOrigin: "center",
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: scale > 1 ? "none" : "auto",
            }}
            onLoad={() => setIsLoaded(true)}
            unoptimized
          />

          {/* Loading state */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#bf9d6d]/30 border-t-[#bf9d6d] rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Controles de navegación (solo si hay múltiples imágenes) */}
        {(hasPrevious || hasNext) && (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-[#bf9d6d]/20 bg-[#f0e3d7]/50 text-[#bf9d6d] backdrop-blur-sm">
              <button
                type="button"
                onClick={onPrevious}
                aria-label="Imagen anterior"
                className={buttonClassName}
                disabled={!hasPrevious}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-[#bf9d6d]/30"></div>
              <button
                type="button"
                onClick={onNext}
                aria-label="Siguiente imagen"
                className={buttonClassName}
                disabled={!hasNext}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

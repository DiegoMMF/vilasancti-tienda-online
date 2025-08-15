"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { GridTileImage } from "components/grid/tile";
import { useProduct } from "components/product/product-context";
import Image from "next/image";
import { useEffect, useState } from "react";

// Importar el GlassSpinner oficial
function GlassSpinner() {
  return (
    <div className="relative grid place-items-center">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#bf9d6d]/30 border-t-[#bf9d6d] sm:h-8 sm:w-8" />
      <div className="absolute inset-0 rounded-full bg-[#f0e3d7]/20 blur-lg" />
    </div>
  );
}

// Componente de loader para imágenes usando el GlassSpinner oficial
function ImageLoader() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 dark:bg-black/90 transition-opacity duration-300 ease-in-out">
      <GlassSpinner />
    </div>
  );
}

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const { state, updateImage } = useProduct();
  const imageIndex = state.image ? parseInt(state.image) : 0;
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(imageIndex);

  // Sincronizar el estado local con el estado del contexto
  useEffect(() => {
    setCurrentImageIndex(imageIndex);
  }, [imageIndex]);

  const nextImageIndex =
    currentImageIndex + 1 < images.length ? currentImageIndex + 1 : 0;
  const previousImageIndex =
    currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;

  const buttonClassName =
    "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] hover:no-underline rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

  const handleImageChange = (newIndex: number) => {
    setIsLoading(true);
    setCurrentImageIndex(newIndex);
    updateImage(newIndex.toString());
  };

  const handleImageLoad = () => {
    // Delay más largo para que el loader sea visible
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div>
      <div className="relative aspect-square h-full max-h-[80vh] w-full max-w-[80vw] mx-auto overflow-hidden">
        {isLoading && <ImageLoader />}

        {images[currentImageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[currentImageIndex]?.altText as string}
            src={images[currentImageIndex]?.src as string}
            priority={true}
            onLoad={handleImageLoad}
            onError={handleImageLoad}
          />
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-[#bf9d6d]/20 bg-[#f0e3d7]/50 text-[#bf9d6d] backdrop-blur-sm">
              <button
                type="button"
                onClick={() => {
                  handleImageChange(previousImageIndex);
                }}
                aria-label="Previous product image"
                className={buttonClassName}
                disabled={isLoading}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-[#bf9d6d]/30"></div>
              <button
                type="button"
                onClick={() => {
                  handleImageChange(nextImageIndex);
                }}
                aria-label="Next product image"
                className={buttonClassName}
                disabled={isLoading}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="my-12 flex items-center flex-wrap justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === currentImageIndex;

            return (
              <li key={image.src} className="h-20 w-20">
                <button
                  type="button"
                  onClick={() => {
                    handleImageChange(index);
                  }}
                  aria-label="Select product image"
                  className="h-full w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

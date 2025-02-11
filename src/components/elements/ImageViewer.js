import { useState } from "react";
import { useImageLoader } from "../../hooks/useImageLoader";

export const ImageViewer = ({ src, alt, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { imageLoaded, handleLoadImage } = useImageLoader();

  return (
    <>
      {!imageLoaded && (
        <div className="max-w-full max-h-[500px] w-full h-60 bg-gray-300 animate-pulse rounded-lg"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={className + " cursor-pointer"}
        onClick={() => setIsOpen(true)}
        onLoad={handleLoadImage}
      />

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-white text-2xl px-2 bg-gray-200 bg-opacity-50 rounded-xl"
            >
              ✖
            </button>
            <img src={src} alt={alt} className="max-w-full max-h-screen rounded-lg" />
          </div>
        </div>
      )}
    </>
  );
};
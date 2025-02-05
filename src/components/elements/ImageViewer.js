import { useState } from "react";

export const ImageViewer = ({ src, alt, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={className + " cursor-pointer"}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-white text-2xl"
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
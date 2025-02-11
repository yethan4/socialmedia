import { useState } from "react";

export const useImageLoader = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLoadImage = () => setImageLoaded(true);

  return { imageLoaded, handleLoadImage };
};

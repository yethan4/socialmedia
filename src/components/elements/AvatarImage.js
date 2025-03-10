import { useMemo } from "react";
import { useImageLoader } from "../../hooks/useImageLoader";

export const AvatarImage = ({ src, size }) => {
  const { imageLoaded, handleLoadImage } = useImageLoader();

  const classNameCategory = useMemo(() => ({
    size: { 
      8: "w-8 h-8 rounded-full", 
      9: "w-9 h-9 rounded-full",
      10: "w-10 h-10 rounded-full",
      11: "w-10 h-10 rounded-full",
      12: "w-12 h-12 rounded-full",
      24: "w-24 h-24 rounded-full",
      40: "w-40 h-40 rounded",
      48: "w-48 h-48 rounded-full border-2 border-white"
    },
    kind: {
      div: "bg-gray-300 dark:bg-gray-600 animate-pulse absolute top-0 left-0",
      img: "object-cover cursor-pointer ring-gray-50 dark:ring-gray-700",
    }
  }), []);

  return (
    <div style={{position: "relative"}} className={classNameCategory.size[size]}>
      {!imageLoaded && <div className={`${classNameCategory.size[size]} ${classNameCategory.kind.div}`} />}
      <img 
        src={src} 
        alt="avatar" 
        className={`${classNameCategory.size[size]} ${classNameCategory.kind.img} ${!imageLoaded && "hidden"}`}
        onLoad={handleLoadImage}
      />
    </div>
  );
};

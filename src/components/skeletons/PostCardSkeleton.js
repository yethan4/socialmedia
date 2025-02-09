import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDarkMode } from "../../hooks/useDarkMode"; 

export const PostCardSkeleton = () => {
  const { darkMode } = useDarkMode(); 

  return (
    <SkeletonTheme
      baseColor={darkMode ? "#2D3748" : "#E0E0E0"} 
      highlightColor={darkMode ? "#4A5568" : "#F5F5F5"} 
    >
      <div className="max-lg:w-[480px] max-lg:mx-auto border-b pb-4 mb-4 shadow px-2 pb-20 dark:shadow-gray-600 dark:border-gray-500">
        <div className="flex gap-2 items-center mt-4">
          <Skeleton circle height={40} width={40} />
          <Skeleton height={30} width={200} />
        </div>

        <div className="h-[300px] mx-2 mt-2">
          <Skeleton height="100%" width="100%" />
        </div>
      </div>
    </SkeletonTheme>
  );
};

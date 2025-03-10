import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDarkMode } from "../../hooks/useDarkMode"; // Jeśli masz hooka do dark mode

export const CreatePostSkeleton = () => {
  const { darkMode } = useDarkMode(); 

  return (
    <SkeletonTheme
      baseColor={darkMode ? "#2D3748" : "#E0E0E0"}
      highlightColor={darkMode ? "#4A5568" : "#F5F5F5"}
    >
      <div className="w-full bg-white shadow mx-auto p-2 py-4 rounded-xl dark:bg-gray-800 max-lg:max-w-[480px] mb-4">
        <div className="flex flex-col gap-2">
          {/* Avatar and username skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton circle height={40} width={40} />
            <Skeleton width={150} height={20} />
          </div>

          {/* Textarea skeleton */}
          <Skeleton height={60} width="100%" className="rounded-2xl"/>
        </div>
        
        <div className="mt-3 flex justify-between">
          <div className="flex items-center gap-1">
            {/* Emoji button skeleton */}
            <Skeleton width={30} height={30} circle />
            <Skeleton width={50} height={20} />

            {/* Upload image button skeleton */}
            <Skeleton width={30} height={30} circle />
            <Skeleton width={80} height={20} />
          </div>
          
          {/* Submit button skeleton */}
          <Skeleton width={100} height={35} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

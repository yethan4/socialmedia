import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDarkMode } from "../../hooks/useDarkMode";

export const HeaderSkeleton = () => {
  const {darkMode} = useDarkMode();

  return (
    <SkeletonTheme 
      baseColor={darkMode ? "#2D3748" : "#E0E0E0"} 
      highlightColor={darkMode ? "#4A5568" : "#F5F5F5"}
    >
      <header className="z-50 fixed left-0 right-0 top-0 select-none">
        <nav className="bg-white border-gray-200 px-4 pt-2 pb-1 border-b-2 text-gray-800 dark:bg-gray-900 dark:text-slate-100 dark:border-gray-700">
          <div className="md flex justify-between items-center">
            <div className="flex gap-2">
              {/* Logo Placeholder */}
              <div className="w-32 h-10">
                <Skeleton height={32} width={128} />
              </div>

              {/* Search Bar Placeholder */}
              <div className="max-md:hidden w-64 h-10">
                <Skeleton height={36} className="rounded-xl"/>
              </div>
            </div>
            

            {/* Icons Placeholder */}
            <div className="flex items-center gap-4">
              <Skeleton circle height={32} width={32} />
              <Skeleton circle height={32} width={32} />
              <Skeleton circle height={32} width={32} />
              <Skeleton circle height={32} width={32} />
            </div>
          </div>
        </nav>
      </header>
    </SkeletonTheme>
  );
};

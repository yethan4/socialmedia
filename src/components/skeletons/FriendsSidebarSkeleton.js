import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDarkMode } from "../../hooks/useDarkMode"; // Jeśli masz hooka do dark mode

export const FriendsSidebarSkeleton = () => {
  const { darkMode } = useDarkMode(); // Hook do sprawdzania trybu ciemnego

  return (
    <SkeletonTheme
      baseColor={darkMode ? "#2D3748" : "#E0E0E0"} // Kolor podstawowy (ciemny vs jasny)
      highlightColor={darkMode ? "#4A5568" : "#F5F5F5"} // Kolor podświetlenia (ciemny vs jasny)
    >
      <div className="font-medium max-md:hidden sticky top-20 right-0 flex-1 h-[90vh] max-w-[350px] px-4 border-l overflow-y-scroll dark-scrollbar scrollbar-hidden hover:scrollbar-thin hover-scrollbar dark:border-gray-700 rounded-lg dark:text-slate-200">
        <div className="ml-4 mb-2 text-lg">
          <Skeleton width={100} height={20} /> {/* Placeholder for Friends title */}
        </div>
        
        {/* Placeholder for the list of friends */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton circle height={40} width={40} /> {/* Placeholder for friend avatar */}
              <Skeleton height={20} width={120} /> {/* Placeholder for friend name */}
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDarkMode } from "../../hooks/useDarkMode";

export const SidebarSkeleton = () => {
  const { darkMode } = useDarkMode();

  const links = [
    { title: "Friends", hasBadge: false },
    { title: "Groups", hasBadge: true },
    { title: "Chats", hasBadge: false },
    { title: "Bookmarks", hasBadge: false },
    { title: "Events", hasBadge: false },
    { title: "Mems", hasBadge: true },
    { title: "Notifications", hasBadge: false },
    { title: "Settings", hasBadge: false },
    { title: "My Posts", hasBadge: false },
    { title: "My Activity", hasBadge: false },
  ];

  return (
    <SkeletonTheme 
      baseColor={darkMode ? "#2D3748" : "#E0E0E0"} 
      highlightColor={darkMode ? "#4A5568" : "#F5F5F5"}
    >
      <div className="max-xl:hidden font-medium sticky top-20 flex-1 h-[90vh] max-w-[350px] ml-10 flex flex-col gap-2 border-r dark:border-gray-700 dark:text-slate-200 dark:bg-gray-900 rounded-lg">
        
        {/* User Info Placeholder */}
        <div className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
          <Skeleton circle height={48} width={48} />
          <div className="flex flex-col gap-2">
            <Skeleton width={120} height={20} />
            <Skeleton width={80} height={16} />
          </div>
        </div>

        {/* Sidebar Links Section */}
        <div className="border-b dark:border-gray-700 mt-2 pb-3">
          {links.slice(0, 3).map((link, index) => (
            <div key={index} className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <Skeleton height={24} width={24} />
              <Skeleton width={80} height={20} className="ml-2" />
              {link.hasBadge && (
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                  <Skeleton width={40} height={16} />
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="border-b dark:border-gray-700 mt-2 pb-3">
          {links.slice(3, 6).map((link, index) => (
            <div key={index} className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <Skeleton height={24} width={24} />
              <Skeleton width={80} height={20} className="ml-2" />
              {link.hasBadge && (
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                  <Skeleton width={40} height={16} />
                </span>
              )}
            </div>
          ))}
        </div>

        <div>
          {links.slice(6).map((link, index) => (
            <div key={index} className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <Skeleton height={24} width={24} />
              <Skeleton width={80} height={20} className="ml-2" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

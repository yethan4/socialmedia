import { useDarkMode } from "../hooks/useDarkMode";

export const LoadingPage = () => {
  useDarkMode();

  return (
    <div className="fixed flex items-center justify-center h-full w-full dark:bg-gray-900 pb-20">
      <div className="shadow px-8 py-4 flex flex-col items-center dark:shadow-gray-700">
        <span className="text-4xl font-bold text-blue-800">SocialApp</span>
        <div className="mt-4 w-24 h-2 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
      </div>
    </div>
  );
};

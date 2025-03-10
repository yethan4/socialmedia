import "react-loading-skeleton/dist/skeleton.css";
import { PostCardSkeleton } from "./PostCardSkeleton";
import { FriendsSidebarSkeleton } from "./FriendsSidebarSkeleton";
import { CreatePostSkeleton } from "./CreatePostSkeleton";

export const HomeSkeleton = () => {
  const posts = new Array(2).fill({});

  return (
    <div className="bg-gray-0 h-full flex-1 w-full max-w-[1000px] sm:min-w-[480px]">
      <div className="container max-w-full sm:max-w-[700px] m-auto flex flex-col">
        <CreatePostSkeleton />
        <div className="mt-4 flex flex-col gap-6 mb-8">
          {/* Display Skeleton for Posts */}
          {posts.map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
        {/* Element obserwowany na dole */}
      </div>
    </div>
  );
};

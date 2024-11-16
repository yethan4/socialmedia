import { useEffect, useRef, useState } from "react";
import { FriendsSidebar, Sidebar } from "./components";

import { CreatePost, PostCard } from "../../components";

export const Home = () => {
  return (
    <div className="flex h-full w-full pt-24 dark:bg-gray-900">
      <Sidebar />
      <div className="bg-gray-0 h-full flex-1 max-w-[1000px] min-w-[700px] max-lg:min-w-[480px]">
        <div className="container max-w-[700px] m-auto flex flex-col">
          <CreatePost />
          <div className="h-[3000px] mt-8 flex flex-col gap-6">
            <PostCard />
            {/* post2 */}
            <PostCard />
            {/* koniecpost2 */}
          </div>
        </div>
      </div>
      <FriendsSidebar />
    </div>
  );
};

import { useEffect, useRef, useState } from "react";
import { FriendsSidebar, Sidebar } from "./components";

import { CreatePost, PostCard } from "../../components";

export const Home = () => {
  return (
    <div className="flex h-full w-full pt-20 dark:bg-gray-900">
      <Sidebar />
      <div className="bg-gray-0 h-full flex-1 w-full max-w-[1000px] sm:min-w-[480px]">
        <div className="container max-w-full sm:max-w-[700px] m-auto flex flex-col">
          <CreatePost />
          <div className="mt-8 flex flex-col gap-6">
            <PostCard />
            <PostCard />
          </div>
        </div>
      </div>
      <FriendsSidebar />
    </div>
  );
};

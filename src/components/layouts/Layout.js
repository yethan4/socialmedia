import { useState } from "react";
import { Sidebar } from "../layouts/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarSkeleton } from "../skeletons";
import { FriendsSidebar } from "../../pages/Home/components";

export const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex pt-20">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center mt-0 m-auto dark:text-slate-100">
        <Outlet />
      </div>
      <FriendsSidebar />
    </div>
  );
};

import { Sidebar } from "../layouts/Sidebar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="flex pt-20">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center mt-0 m-auto dark:text-slate-100">
        <Outlet />
      </div>
    </div>
  );
};

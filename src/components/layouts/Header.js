import { useEffect, useState } from "react"
import { DropDownMenu, DropDownMenuSm } from "../";

export const Header = () => {
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")) || false);
  const [dropDwonMenu, setDropDwonMenu] = useState(false);

  const user = false;

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    if(darkMode){
      document.documentElement.classList.add('dark');
    }else{
      document.documentElement.classList.remove('dark');
    }

  },[darkMode])

  return (
    <header className="z-30 fixed left-0 right-0 top-0">
      <nav className="bg-white border-gray-200 px-4 pt-2 pb-1 border-b-2 text-gray-800 dark:bg-gray-900 dark:text-slate-100 dark:border-gray-700">
        <div className="md flex justify-between">
          <div className="max-lg:hidden w-64 h-12 flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-800 select-none cursor-pointer">SocialApp</span>
            { user && (
            <div className="relative flex">
              <i className="bi bi-search absolute top-2 left-2 text-gray-400"></i>
              <input name="search" type="text" className="w-64 pl-8 py-2 text-md text-gray-700 shadow rounded-xl outline-none focus:ring-2 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700" placeholder="Search" autoComplete="off" />
            </div>
            )}
          </div>
          <div className="lg:hidden h-12 pt-2">
            <span className="text-2xl font-bold text-blue-800">SocialApp</span>
            {user && 
            <span>
              <i className="bi bi-search ml-1 rounded-full py-1 px-2 text-xl cursor-pointer hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"></i>
            </span>}
          </div>
          <div className="flex items-center gap-2">
            { user && (
              <>
                {darkMode ? (
                <span className=" rounded-full p-1 px-2 text-2xl cursor-pointer dark:hover:bg-gray-800" onClick={() => setDarkMode(false)}>
                  <i className="bi bi-brightness-high"></i>
                </span>
                ):(
                <span className="rounded-full py-1 px-2 text-2xl cursor-pointer hover:bg-gray-50" onClick={() => setDarkMode(true)}>
                  <i className="bi bi-moon"></i>
                </span>
                )}
                <span className="relative rounded-full py-1 px-2 text-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <p className="absolute top-0 right-1 text-xs rounded-full text-slate-100 bg-red-500 px-1 select-none">3</p>
                  <i className="bi bi-chat"></i>
                </span>
                <span className="relative rounded-full py-1 px-2 text-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <p className="absolute top-0 right-1 text-xs rounded-full text-slate-100 bg-red-500 px-1 select-none">8</p>
                  <i className="bi bi-bell "></i>
                </span>
                <span className="rounded-full" onClick={() => setDropDwonMenu(!dropDwonMenu)}>
                  <img src="avatar.jpg" alt="" className="object-cover w-10 h-10 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700 hover:ring-2" />
                </span>
              </>
            )}
           { !user && (
              <>
              {darkMode ? (
                <span className=" rounded-full p-1 px-2 text-2xl cursor-pointer dark:hover:bg-gray-800" onClick={() => setDarkMode(false)}>
                  <i className="bi bi-brightness-high"></i>
                </span>
                ):(
                <span className="rounded-full py-1 px-2 text-2xl cursor-pointer hover:bg-gray-50" onClick={() => setDarkMode(true)}>
                  <i className="bi bi-moon"></i>
                </span>
              )}
              </>
           )}
            
          </div>
          {dropDwonMenu && <DropDownMenu />}
          {dropDwonMenu && <DropDownMenuSm />}
        </div>
      </nav>
    </header>
  )
}

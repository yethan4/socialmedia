import { Sidebar } from "../../components";
import { CreateMessage } from "./CreateMessage";

export const ChatsPage = () => {
  return (
    <div className="flex pt-20 h-screen"> 
      <Sidebar />
      <div className="flex-1 flex mt-0 pl-2 pr-8 dark:text-slate-100">
        <div className="w-[350px]">
          <div className="mb-2 text-center text-xl text-gray-900 font-semibold dark:text-gray-100">Chats</div>

          <div className="relative flex flex-col">
            <i className="bi bi-search absolute top-1 left-2 text-gray-400"></i>
            <input
              name="search"
              type="text"
              className="pl-8 py-1 mr-2 text-md text-gray-700 shadow rounded-xl outline-none focus:ring-2 ring-gray-200 dark:bg-gray-800 dark:text-slate-100 dark:ring-gray-700"
              placeholder="Search in chats"
              autoComplete="off"
            />
          </div>

          {/* Chats */}
          <div className="flex flex-col mt-3">
            <div className="flex py-2 px-1 cursor-pointer rounded-md hover:bg-gray-300">
              <div className="relative w-fit h-fit">
                <img
                  src="./dog1.jpg"
                  alt=""
                  className="object-cover w-11 h-11 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-300 bg-green-500 dark:border-gray-500"></div>
              </div>

              <div className="ml-2 flex flex-col">
                <div className="flex items-center">
                  <span>Usernameeeeeeee</span>
                  <span className="h-fit w-fit">
                    <i className="bi bi-dot"></i>
                  </span>
                  <span className="text-[9px]">12 minutes</span>
                </div>
                <span className="max-w-[270px] text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  You: Lorem ipsum dolor sit, amet consectetur adipisicing.
                </span>
              </div>
            </div>

            <div className="flex py-2 px-1 cursor-pointer rounded-md hover:bg-gray-300">
              <div className="relative w-fit h-fit">
                <img
                  src="./dog1.jpg"
                  alt=""
                  className="object-cover w-11 h-11 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-400 bg-gray-700 dark:border-gray-500"></div>
              </div>

              <div className="ml-2 flex flex-col">
                <div className="flex items-center">
                  <span>User</span>
                  <span className="h-fit w-fit">
                    <i className="bi bi-dot"></i>
                  </span>
                  <span className="text-[9px]">12 minutes</span>
                </div>
                <span className="max-w-[270px] text-xs font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                  Lorem ipsum dolor sit, amet consectetur adipisicing.
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Główny div */}
        <div className="flex-1 h-full border-l flex flex-col">
          <div className="pl-2 py-2 flex shadow">
            <div className="relative w-fit h-fit">
              <img
                src="./dog1.jpg"
                alt=""
                className="object-cover w-12 h-12 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-400 bg-green-500 dark:border-gray-500"></div>
            </div>
            <div className="flex flex-col ml-2 justify-center">
              <span className="text-lg font-semibold">Username</span>
              <span className="text-xs font-medium text-green-500">Now</span>
            </div>
          </div>

          <div className="mt-3 flex gap-2 flex-col w-full px-2 flex-1">
            <div className="bg-gray-200 w-fit min-w-[200px] max-w-[800px] mr-10 px-2 py-2 rounded-xl dark:bg-gray-700 dark:text-slate-50">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </div>
            <div className="bg-blue-600 text-slate-50 w-fit max-w-[300px] ml-auto px-2 py-2 rounded-xl">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos, minima!
            </div>
            <div className="bg-gray-200 w-fit min-w-[200px] max-w-[800px] mr-10 px-2 py-2 rounded-xl dark:bg-gray-700 dark:text-slate-50">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
            </div>
          </div>

          {/* Ten div będzie na dole */}
          <CreateMessage />
          
        </div>


      </div>
    </div>
  );
};

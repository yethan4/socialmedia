import { Link } from "react-router-dom"

export const Options = () => {
  return (
    <div className="bg-gray-0 h-full flex-1 w-full px-4">
        <Link to="/my-activity/likes">
          <div className="flex items-center w-full  px-10 py-2 rounded-xl select-none cursor-pointer hover:bg-gray-50 dark:bg-gray-900 dark:text-slate-50 dark:hover:bg-gray-800" >
            <div className="m-auto flex items-center px-10 py-2 rounded-xl select-none cursor-pointer">
              <span className="text-xl pb-1 mb-1 mr-2 px-2 pt-1 bg-red-600 text-white rounded-full dark:bg-blue-700 dark:text-slate-50">
                <i class="bi bi-heart"></i>
              </span>
              <span className="text-2xl mb-1">Check likes</span>
              <span className="ml-4 mb-1 text-xl">
                <i className="bi bi-arrow-right"></i>
              </span>
            </div>
          </div>
        </Link>

        <hr />

        <Link to="/my-activity/comments">
          <div className="flex items-center w-full px-10 pb-2 pt-4 rounded-xl select-none cursor-pointer hover:bg-gray-50 dark:bg-gray-900 dark:text-slate-50 dark:hover:bg-gray-800">
            <div className="m-auto flex items-center px-10 py-2 rounded-xl select-none cursor-pointer">
              <span className="text-xl pb-1 mb-1 mr-2 px-2 pt-1 bg-blue-600 text-white rounded-full dark:bg-blue-700 dark:text-slate-50">
                <i class="bi bi-chat "></i>
              </span>
              <span className="text-2xl mb-1">Check comments</span>
              <span className="ml-4 mb-1 text-xl">
                <i className="bi bi-arrow-right"></i>
              </span>
            </div>
          </div>
        </Link>
    </div>
  )
}

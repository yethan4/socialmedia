import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../../services/authService";
import { Link } from "react-router-dom";
import { AvatarImage } from "./AvatarImage";

export const DropDownMenu = ({setDropDwonMenu}) => {
  const currentUser = useSelector(state => state.authState.userInfo);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await signOutUser(dispatch);
    setDropDwonMenu(false);
  };

  return (
    <div className="max-sm:hidden absolute flex flex-col top-[62px] right-2 w-64 p-1 h-fit rounded border-b border-l shadow bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
      <Link to={`/profile/${currentUser?.id}`}>
        <div className="flex items-center justify-center gap-2 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
          <AvatarImage src={currentUser?.avatar} size={12}/>
          <span>{currentUser?.username}</span>
        </div>
      </Link>
      <Link to="/settings">
      <div className="px-4 py-3 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
        <i className="bi bi-gear text-xl"></i>
        <span className="ml-2 text-md">Settings</span>
      </div>
      </Link>
      <Link to="/my-activity">
      <div className="px-4 py-3 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
        <i className="bi bi-journal text-xl"></i>
        <span className="ml-2 text-md">Activity</span>
      </div>
      </Link>
      <div className="px-4 py-3 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700" onClick={handleLogout}>
        <i className="bi bi-door-closed text-xl"></i>
        <span className="ml-2 text-md">Logout</span>
      </div>
    </div>
  )
}

import { Link } from "react-router-dom";
import { signOutUser } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux"; // Dodajemy hook `useDispatch`

export const DropDownMenuSm = ({setDropDwonMenu}) => {
  const userInfo = useSelector(state => state.authState.userInfo);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await signOutUser(dispatch);
    setDropDwonMenu(false);
  };

  return (
    <div className="sm:hidden absolute flex flex-col left-0 right-0 top-[62px] p-1 h-fit rounded border-b border-l shadow bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
      
      <Link to={`/profile/${userInfo?.id}`}>
        <div className="flex items-center justify-center gap-2 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
          <img
            src={userInfo?.avatar}
            alt=""
            className="object-cover w-12 h-12 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700"
          />
          <span>{userInfo?.username}</span>
        </div>
      </Link>
      <Link to="/settings">
      <div className="px-4 py-3 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
        <i className="bi bi-gear text-xl"></i>
        <span className="ml-2 text-md">Settings</span>
      </div>
      </Link>
      <div className="px-4 py-3 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
        <i className="bi bi-journal text-xl"></i>
        <span className="ml-2 text-md">Activity</span>
      </div>
      <div className="px-4 py-3 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700" onClick={handleLogout}>
        <i className="bi bi-door-closed text-xl"></i>
        <span className="ml-2 text-md">Logout</span>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react"
import { DropDownMenu, DropDownMenuSm, DropDownNotifications, SearchBar, SearchBarSm } from "..";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { setNotifications } from "../../actions/notificationsAction";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

export const Header = () => {
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")) || false);
  const [dropDwonMenu, setDropDwonMenu] = useState(false);
  const [dropNotifications, setDropNotifications] = useState(false);
  const [inputSearchBar, setInputSearchBar] = useState("");

  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.authState.userInfo);
  const notificationsCounter = useSelector(state => state.notificationsState.unreadCount);

  const showDropMenu = (state) => {
    setDropNotifications(false);
    setDropDwonMenu(state);
  };

  const showDropNotifications = (state) => {
    setDropDwonMenu(false);
    setDropNotifications(state);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    if(darkMode){
      document.documentElement.classList.add('dark');
    }else{
      document.documentElement.classList.remove('dark');
    }

  },[darkMode])

  useEffect(() => {
    if (!userInfo?.id) return;

    const q = query(
      collection(db, "notifications"),
      where("toUserId", "==", userInfo.id),
      where("seen", "==", false),
      orderBy("timestamp", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setNotifications(newNotifications));
    });

    return () => unsubscribe();
  }, [userInfo?.id, dispatch]);


  

  return (
    <header className="z-50 fixed left-0 right-0 top-0 select-none">
      <nav className="bg-white border-gray-200 px-4 pt-2 pb-1 border-b-2 text-gray-800 dark:bg-gray-900 dark:text-slate-100 dark:border-gray-700">
        <div className="md flex justify-between">
          <div className="max-md:hidden w-64 h-12 flex items-center gap-2">
            <Link to="/">
              <span onClick={handleScrollTop} className="text-2xl font-bold text-blue-800 select-none cursor-pointer">SocialApp</span>
            </Link>
            { userInfo && (
              <SearchBar inputSearchBar={inputSearchBar} setInputSearchBar={setInputSearchBar} />
            )}
          </div>
          <div className="md:hidden flex h-12 pt-2">
            <Link to="/"><span className="text-2xl font-bold text-blue-800">SocialApp</span></Link>
            {userInfo && (
              <SearchBarSm inputSearchBar={inputSearchBar} setInputSearchBar={setInputSearchBar} />
            )}
          </div>
          <div className="flex items-center gap-2">
            { userInfo && (
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
                <span className="relative rounded-full py-1 px-2 text-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => showDropNotifications(!dropNotifications)}>
                  <p className="absolute top-0 right-1 text-xs rounded-full text-slate-100 bg-red-500 px-1 select-none">{notificationsCounter>0 ? notificationsCounter : ""}</p>
                  <i className="bi bi-bell "></i>
                </span>
                <span className="rounded-full" onClick={() => showDropMenu(!dropDwonMenu)}>
                  <img src={userInfo.avatar} alt="" className="object-cover w-9 h-9 mb-1 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700 hover:ring-2" />
                </span>
              </>
            )}
           { !userInfo && (
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
          {dropDwonMenu && <DropDownMenu setDropDwonMenu={setDropDwonMenu} />}
          {dropDwonMenu && <DropDownMenuSm setDropDwonMenu={setDropDwonMenu} />}
          {dropNotifications && <DropDownNotifications setDropNotifications={setDropNotifications} />}
        </div>
      </nav>
    </header>
  )
}

import { useEffect, useState } from "react";
import { AvatarImage, DropDownChats, DropDownMenu, DropDownMenuSm, DropDownNotifications, SearchBar, SearchBarSm } from "..";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { db } from "../../firebase/config";
import { setNotifications } from "../../actions/notificationsAction";
import { collection, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { setChats } from "../../actions/chatsAction";
import { useDarkMode } from "../../hooks/useDarkMode";

export const Header = () => {
  const {darkMode, setDarkMode} = useDarkMode();
  const [dropDwonMenu, setDropDwonMenu] = useState(false);
  const [dropNotifications, setDropNotifications] = useState(false);
  const [dropChats, setDropChats] = useState(false);  
  const [inputSearchBar, setInputSearchBar] = useState("");
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const dispatch = useDispatch();
  const location = useLocation();
  const isChatsPage = location.pathname.startsWith("/chats")

  const currentUser = useSelector(state => state.authState.userInfo);
  const notificationsCounter = useSelector(state => state.notificationsState.unreadCount);

  const showDropMenu = (state) => {
    setDropNotifications(false);
    setDropChats(false);  
    setDropDwonMenu(state);
  };

  const showDropNotifications = (state) => {
    setDropDwonMenu(false);
    setDropChats(false);  
    setDropNotifications(state);
  };

  const showDropChats = (state) => {
    setDropDwonMenu(false); 
    setDropNotifications(false); 
    setDropChats(state);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if(isChatsPage) setDropChats(false); 
  }, [isChatsPage])
  
  useEffect(() => {
    if (!currentUser?.id) return;

    const q = query(
      collection(db, "notifications"),
      where("toUserId", "==", currentUser.id),
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
  }, [currentUser?.id, dispatch]);

  //fetching chats
  useEffect(() => {
    if (!currentUser) return;
  
    try {
      const unSub = onSnapshot(
        doc(db, "userchats", currentUser.id),
        (res) => {
          if (!res.exists()) return;
  
          try {
            const items = res.data()?.chats || [];
            const filteredChats = items.filter(chat => !chat?.isDeleted)
            const sortedChats = filteredChats.sort((a, b) => b.updatedAt - a.updatedAt);
            const newMessages = sortedChats.filter(chat => !chat.isSeen).length;
  
            dispatch(setChats(sortedChats));
            setUnreadMessagesCount(newMessages);
          } catch (innerError) {
            console.error("Błąd przetwarzania danych z Firestore:", innerError);
          }
        },
        (error) => {
          console.error("Błąd nasłuchiwania Firestore:", error);
        }
      );
  
      return () => unSub();
    } catch (error) {
      console.error("Błąd w useEffect:", error);
    }
  }, [currentUser?.id, dispatch, currentUser]);


  return (
    <header className="z-50 fixed left-0 right-0 top-0 select-none">
      <nav className="bg-white border-gray-200 px-4 pt-2 pb-1 border-b-2 text-gray-800 dark:bg-gray-900 dark:text-slate-100 dark:border-gray-700">
        <div className="md flex justify-between">
          <div className="max-md:hidden w-64 h-12 flex items-center gap-2">
            <Link to="/">
              <span onClick={handleScrollTop} className="text-2xl font-bold text-blue-800 select-none cursor-pointer">SocialApp</span>
            </Link>
            {currentUser && (
              <SearchBar inputSearchBar={inputSearchBar} setInputSearchBar={setInputSearchBar} />
            )}
          </div>
          <div className="md:hidden flex h-12 pt-2">
            <Link to="/"><span className="text-2xl font-bold text-blue-800">SocialApp</span></Link>
            {currentUser && (
              <SearchBarSm inputSearchBar={inputSearchBar} setInputSearchBar={setInputSearchBar} />
            )}
          </div>
          <div className="flex items-center gap-2">
            {currentUser && (
              <>
                {darkMode ? (
                <span className=" rounded-full p-1 px-2 text-2xl cursor-pointer dark:hover:bg-gray-800" onClick={() => setDarkMode(false)}>
                  <i className="bi bi-brightness-high"></i>
                </span>
                ) : (
                <span className="rounded-full py-1 px-2 text-2xl cursor-pointer hover:bg-gray-50" onClick={() => setDarkMode(true)}>
                  <i className="bi bi-moon"></i>
                </span>
                )}
                {!isChatsPage && (
                    <span className="relative rounded-full py-1 px-2 text-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => showDropChats(!dropChats)}>
                    <p className="absolute top-0 right-1 text-xs rounded-full text-slate-100 bg-red-500 px-1 select-none">
                      {unreadMessagesCount > 0 && unreadMessagesCount}
                    </p>
                    <i className="bi bi-chat"></i>
                  </span>
                )}
                <span className="relative rounded-full py-1 px-2 text-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => showDropNotifications(!dropNotifications)}>
                  <p className="absolute top-0 right-1 text-xs rounded-full text-slate-100 bg-red-500 px-1 select-none">{notificationsCounter>0 ? notificationsCounter : ""}</p>
                  <i className="bi bi-bell "></i>
                </span>
                <span className="rounded-full mb-1" onClick={() => showDropMenu(!dropDwonMenu)}>
                  <AvatarImage src={currentUser?.avatar} size={9}/>
                </span>
              </>
            )}
            {!currentUser && (
              <>
                {darkMode ? (
                <span className=" rounded-full p-1 px-2 text-2xl cursor-pointer dark:hover:bg-gray-800" onClick={() => setDarkMode(false)}>
                  <i className="bi bi-brightness-high"></i>
                </span>
                ) : (
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
          {!isChatsPage && dropChats && <DropDownChats setDropChats={setDropChats} />}
        </div>
      </nav>
    </header>
  );
}

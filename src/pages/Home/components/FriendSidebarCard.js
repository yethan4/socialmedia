import { useEffect, useState } from "react";
import { database } from "../../../firebase/config";
import { ref, onValue } from "firebase/database"; // importujemy onValue
import { fetchDocument } from "../../../services/fetchDocument";
import { formatTimestamp } from "../../../utils/timeUtils";
import { Link } from "react-router-dom";

export const FriendSidebarCard = ({ userId }) => {
  const [userData, setUserData] = useState([]);
  const [isOnline, setIsOnline] = useState(false); 
  const [lastActive, setLastActive] = useState(null);

  useEffect(() => {
    const userRef = ref(database, `/presence/${userId}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.val() === true) {
        setIsOnline(true); // if user is online
      } else {
        
        setIsOnline(false); // if user is offline
        const formattedTime = formatTimestamp(snapshot.val().lastActive/1000);
        setLastActive(formattedTime)
      }
    });

    return () => unsubscribe();
  }, [userId]); 

  useEffect(() => {
      fetchDocument(userId, "users").then((user) => setUserData(user))
    }, [userId])

  return (
    <Link to={`/profile/${userId}`}>
    <div className="relative flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
      <div className="relative">
       <img src={userData?.avatar} alt="" className="object-cover w-10 h-10 rounded-full cursor-pointer ring-gray-50 dark:ring-gray-700" />
       {isOnline ? (
        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-300 bg-green-500 dark:border-gray-500"></div>
       ) : (
        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-300 bg-gray-700 dark:border-gray-500"></div>
       )}
      </div>
      <div className="flex flex-col justify-center ">
        <span>{userData?.username}</span>
        {!isOnline && lastActive && (<span className="text-[9px] text-gray-700 font-semibold dark:text-slate-400">{lastActive}</span>)}
      </div>
    </div>
    </Link>
  )
}

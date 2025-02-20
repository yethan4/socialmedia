import { Link } from 'react-router-dom';
import { useFriendStatus } from '../../hooks/useFriendStatus';
import { AvatarImage } from './AvatarImage';

export const FriendCard = ({friendId}) => {
  const {
    friendStatus,
    dropRemove,
    setDropRemove,
    friendInfo,
    handleSentRequest,
    handleRejectRequest,
    handleAddFriend,
    handleRemoveFriend,
    handleUndoRequest
  } = useFriendStatus(friendId);

  return (
    <div className="w-48 h-64 px-1 pt-4 shadow rounded flex flex-col items-center dark:bg-gray-800">
      <Link to={`/profile/${friendId}`}>
        <AvatarImage src={friendInfo?.avatar} size={40}/>
      </Link>
      <div className="flex flex-col items-center relative mt-3">
        {friendInfo?.username ? (
          <Link to={`/profile/${friendId}`}>
            <span className="font-semibold text-gray-900 dark:text-slate-50 hover:underline">{friendInfo?.username}</span>
          </Link>
        ) : (
          <div className="w-24 h-4 mt-1 mb-1 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
        )}
        {friendStatus === "friends" && (
          <div className="mt-1 w-full select-none">
            <button onClick={() => setDropRemove(!dropRemove)} className="pl-4 pr-2 py-1 bg-gray-700 text-slate-50 hover:bg-gray-600 dark:bg-gray-700 dark:text-slate-200 dark:hover:bg-gray-600">
              <i className="bi bi-person-check-fill mr-1"></i>
              Friends<i className="bi bi-three-dots ml-2"></i>
            </button>
            {dropRemove && (
              <button 
                className="absolute top-16 left-0 w-44 text-sm shadow bg-white py-2 select-none text-gray-900 dark:bg-gray-700 dark:text-slate-50 dark:hover:bg-gray-600"
                onClick={handleRemoveFriend}
              >Remove from friends
              </button>)}
          </div>
        )}
        {friendStatus === "strangers" && (
          <button 
            className="px-4 mt-1 py-1 bg-blue-700 text-slate-50 text-sm hover:bg-blue-600"
            onClick={handleSentRequest}
          >Add Friend</button>
        )}
        {friendStatus === "pendingSent" && (
          <button 
            className="px-4 mt-1 py-1 bg-gray-600 text-slate-50 text-sm hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={handleUndoRequest}
          >Remove request</button>
        )}
          {friendStatus === "pendingReceived" && (
            <div className="flex gap-2">
              <button 
                className="px-2 mt-1 py-1 bg-green-600 text-white text-sm hover:bg-green-700"
                onClick={handleAddFriend}
              >Accept</button>
              <button 
                className="px-2 mt-1 py-1 bg-gray-600 text-slate-50 text-sm hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                onClick={handleRejectRequest}
              >Reject</button>
            </div>
        )}
      </div>
    </div>
  )
}

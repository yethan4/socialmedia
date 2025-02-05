import { useEffect, useState } from "react";
import { addFriend, checkFriendStatus, rejectFriendRequest, removeFriend, sentFriendRequest, undoFriendRequest } from "../services/friendsService";
import { useSelector } from "react-redux";
import { fetchDocument } from "../services/fetchDocument";

export const useFriendStatus = (friendId) => {
  const [friendStatus, setFriendStatus] = useState("strangers");
  const [dropRemove, setDropRemove] = useState(false);
  const [friendInfo, setFriendInfo] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [friendRequestId, setFriendRequestId] = useState("");

  const userInfo = useSelector(state => state.authState.userInfo);

  const handleSentRequest= async () => {
      await sentFriendRequest(userInfo.id, friendId);
      setFriendStatus("pendingSent");
    };
  
  const handleRejectRequest = async() => {
    await rejectFriendRequest(userInfo.id, friendId, friendRequestId);
    setFriendStatus("strangers");
  };

  const handleAddFriend = async() => {
    await addFriend(userInfo.id, friendId, friendRequestId);
    setFriendStatus("friends");
  };

  const handleRemoveFriend = async() => {
    await removeFriend(userInfo.id, friendId);
    setFriendStatus("strangers");
  };

  const handleUndoRequest = async() => {
    await undoFriendRequest(userInfo.id, friendId, friendRequestId);
    setFriendStatus("strangers");
  };

  useEffect(() => {
    if (!friendId) return;

    const fetchFriendInfo = async() => {
      const user = await fetchDocument(friendId, "users")
      setFriendInfo(user)
    }
    
    fetchFriendInfo();
  }, [friendId])

  useEffect(() => {
      if(userInfo && friendId && userInfo.id === friendId){
        setIsCurrentUser(true);
      }
    }, [userInfo], [friendId])
  
  useEffect(() => {
      const checkStatus = async() => {
        const {status, requestId} = await checkFriendStatus(userInfo, friendId);
        setFriendStatus(status);
        setFriendRequestId(requestId);
      }
  
      if(userInfo && friendId && !isCurrentUser){
        checkStatus()
      }
    }, [userInfo, friendId, isCurrentUser]);

  return {
    friendStatus,
    dropRemove,
    setDropRemove,
    friendInfo,
    handleSentRequest,
    handleRejectRequest,
    handleAddFriend,
    handleRemoveFriend,
    handleUndoRequest
  };
}
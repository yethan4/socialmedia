import { useEffect, useState, useCallback } from "react";
import { addFriend, checkFriendStatus, rejectFriendRequest, removeFriend, sentFriendRequest, undoFriendRequest } from "../services/friendsService";
import { useSelector } from "react-redux";
import { fetchDocument } from "../services/generalService";
import { toast } from "react-toastify";
import { createNewChat } from "../services/chatService";

export const useFriendStatus = (friendId) => {
  const [friendStatus, setFriendStatus] = useState("strangers");
  const [dropRemove, setDropRemove] = useState(false);
  const [friendInfo, setFriendInfo] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [friendRequestId, setFriendRequestId] = useState("");

  const userInfo = useSelector(state => state.authState.userInfo);

  const handleSentRequest = useCallback(async () => {
    await sentFriendRequest(userInfo.id, friendId);
    setFriendStatus("pendingSent");
  }, [userInfo.id, friendId]);

  const handleRejectRequest = useCallback(async () => {
    await rejectFriendRequest(userInfo.id, friendId, friendRequestId);
    setFriendStatus("strangers");
  }, [userInfo.id, friendId, friendRequestId]);

  const handleAddFriend = useCallback(async () => {
    await addFriend(userInfo.id, friendId, friendRequestId);
    await createNewChat(userInfo.id, friendId);
    setFriendStatus("friends");
  }, [userInfo.id, friendId, friendRequestId]);

  const handleRemoveFriend = useCallback(async () => {
    await removeFriend(userInfo.id, friendId);
    setFriendStatus("strangers");
    toast.info("Friend has been deleted.")
  }, [userInfo.id, friendId]);

  const handleUndoRequest = useCallback(async () => {
    await undoFriendRequest(userInfo.id, friendId, friendRequestId);
    setFriendStatus("strangers");
  }, [userInfo.id, friendId, friendRequestId]);

  useEffect(() => {
    if (!friendId) return;

    const fetchFriendInfo = async () => {
      const user = await fetchDocument(friendId, "users");
      setFriendInfo(user);
    };

    fetchFriendInfo();
  }, [friendId]);

  useEffect(() => {
    if (userInfo && friendId && userInfo.id === friendId) {
      setIsCurrentUser(true);
    }
  }, [userInfo, friendId]); 

  useEffect(() => {
    const checkStatus = async () => {
      const { status, requestId } = await checkFriendStatus(userInfo, friendId);
      setFriendStatus(status);
      setFriendRequestId(requestId);
    };

    if (userInfo && friendId && !isCurrentUser) {
      checkStatus();
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
    handleUndoRequest,
  };
};

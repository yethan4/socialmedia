import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useBlockStatus = (id) => {
  const [blockStatus, setBlockStatus] = useState({
    isCuBlocked: false,
    hasCuBlocked: false, 
    isCuChatBlocked: false, 
    hasCuBlockedChat: false, 
  });
  
  
  const updateBlockStatus = (key, value) => {
    setBlockStatus((prev) => ({ ...prev, [key]: value }));
  };

  const currentUser = useSelector(state => state.authState.userInfo);

  useEffect(() => {
    if (!currentUser && !id) return;

    setBlockStatus({
      isCuBlocked: false,
      hasCuBlocked: false, 
      isCuChatBlocked: false, 
      hasCuBlockedChat: false, 
    })

    if (currentUser?.blockedUsers?.includes(id)) {
      updateBlockStatus("hasCuBlocked", true);
    };

    if (currentUser?.chatBlockedUsers?.includes(id)) {
      updateBlockStatus("hasCuBlockedChat", true);
    };
  
    if (currentUser?.blockedBy?.includes(id)) {
      updateBlockStatus("isCuBlocked", true);
    };

    if (currentUser?.chatBlockedBy?.includes(id)){
      updateBlockStatus("isCuChatBlocked", true);
    }
  }, [currentUser, id]);

  return {blockStatus, updateBlockStatus}
}

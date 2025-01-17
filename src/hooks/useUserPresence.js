import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/config";
import { formatTimestamp } from "../utils/timeUtils";

export const useUserPresence = (userId) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastActive, setLastActive] = useState(null);

  useEffect(() => {
    const userRef = ref(database, `/presence/${userId}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const presenceData = snapshot.val();

      if (presenceData === true) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
        if (presenceData?.lastActive) {
          setLastActive(formatTimestamp(presenceData.lastActive / 1000));
        }
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return { isOnline, lastActive };
};

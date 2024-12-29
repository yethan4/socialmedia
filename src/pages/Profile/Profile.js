import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDocument } from '../../services/fetchDocument';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { CreatePost, PostCard } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { addPosts, setLoading, setPosts } from '../../actions/postsAction';

import loadingGif from "../../assets/loading.gif";
import { useTitle } from '../../hooks/useTitle';
import { addFriend, rejectFriendRequest, removeFriend, sentFriendRequest, undoFriendRequest } from '../../services/friendsService';

export const Profile = () => {
  const { id } = useParams();

  const [userData, setUserData] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [friendStatus, setFriendStatus] = useState(null);
  const [friendRequestId, setFriendRequestId] = useState(null);
  const [dropRemove, setDropRemove] = useState(false);

  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.authState.userInfo);
  const posts = useSelector(state => state.postsState.posts);
  const lastVisible = useSelector(state => state.postsState.lastVisible);
  const loading = useSelector(state => state.postsState.loading);

  const observerRef = useRef(null);

  useTitle(`- Profile`);

  useEffect(() => {
    if (id === userInfo.id) {
      setIsCurrentUser(true);
    } else {
      setIsCurrentUser(false);
    }
  }, [id, userInfo]);

  useEffect(() => {
    if (id) {
      fetchDocument(id, "users").then((user) => {
        setUserData(user);
      });
    }
  }, [id]);

  useEffect(() => {
    const fetchUserDetails = async (id) => {
      try {
        const docRef = doc(db, "userDetails", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          console.log("No such document");
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (id) {
      fetchUserDetails(id).then((details) => {
        setUserDetails(details);
      });
    }
  }, [id]);

  useEffect(() => {
    const fetchUserPosts = async (id) => {
      dispatch(setLoading(true));
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef,
          where("authorId", "==", id),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);

        const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        dispatch(setPosts(posts, lastVisible));
        return posts;

      } catch (err) {
        console.log(err);
      }
    };
    fetchUserPosts(id);
  }, [id]);

  const loadMorePosts = async () => {
    if (!lastVisible) {
      console.warn("Brak kolejnych postów do załadowania.");
      return;
    }

    dispatch(setLoading(true));

    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef,
        where("authorId", "==", id),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(5)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        dispatch(addPosts(posts, newLastVisible));
      } else {
        console.log("Brak więcej postów do załadowania.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && lastVisible && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [lastVisible, loading]);

  useEffect(() => {
    const checkFriendStatus = async () => {
      let status = "strangers";
      if(userInfo.id === id) {
        status = "";
      } else if (userInfo.friends.includes(id)) {
        status = "friends";
      } else {
        try {
          const sentRequests = query(
            collection(db, "friendRequests"),
            where("status", "==", "pending"),
            where("fromUserId", "==", userInfo.id),
            where("toUserId", "==", id)
          );
          const receivedRequests = query(
            collection(db, "friendRequests"),
            where("status", "==", "pending"),
            where("fromUserId", "==", id),
            where("toUserId", "==", userInfo.id)
          );
  
          const sentSnapshot = await getDocs(sentRequests);
          const receivedSnapshot = await getDocs(receivedRequests);
  
          if (!sentSnapshot.empty) {
            status = "pendingSent";
            const docS = sentSnapshot.docs[0];
            setFriendRequestId(docS.id);
          } else if (!receivedSnapshot.empty) {
            const docR = receivedSnapshot.docs[0];
            setFriendRequestId(docR.id);
            status = "pendingReceived";
          }
        } catch (e) {
          console.log(e);
        }
      }
  
      setFriendStatus(status);
    };
  
    if (userInfo) {
      checkFriendStatus();
    } else {
      setFriendStatus(null);
    }
  }, [userInfo, id, isCurrentUser]);

  const handleSentRequest= async () => {
    await sentFriendRequest(userInfo.id, id);
    setFriendStatus("pendingSent");
  };

  const handleRejectRequest = async() => {
    await rejectFriendRequest(userInfo.id, id, friendRequestId);
    setFriendStatus("strangers");
  }

  const handleAddFriend = async() => {
    await addFriend(userInfo.id, id, friendRequestId);
    setFriendStatus("friends");
  }

  const handleRemoveFriend = async() => {
    await removeFriend(userInfo.id, id);
    setFriendStatus("strangers");
  }

  const handleUndoRequest = async() => {
    await undoFriendRequest(userInfo.id, id, friendRequestId);
    setFriendStatus("strangers");
  }

  return (
    <div className="pt-16 w-full max-w-[1200px] h-full mx-auto rounded-lg">
      <div className="relative shadow-lg dark:shadow-gray-800 dark:shadow-sm rounded-lg max-lg:pb-8">
        <div className="relative h-[35vh] bg-cover bg-center" style={{ backgroundImage: "url('/dog2.jpg')" }}>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <img
              src={userData?.avatar}
              alt="User Avatar"
              className="w-48 h-48 rounded-full border-4 border-white object-cover"
            />
          </div>
        </div>

        <div className="mt-16 text-center px-4 pb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{userData?.username}</h2>
        </div>
        <div className="flex max-lg:justify-center absolute bottom-2 left-1 right-1">
          {friendStatus === "pendingSent" && (
            <button className="px-4 py-2 mr-2 shadow dark:bg-gray-800 dark:text-slate-200" onClick={handleUndoRequest}>
              <i className="bi bi-person-dash-fill mr-1"></i>
              Remove request
            </button>
          )}
          {friendStatus === "pendingReceived" && (
            <>
              <button className="px-4 py-2 mr-2 shadow dark:bg-gray-800 dark:text-slate-200" onClick={handleAddFriend}>
                <i className="bi bi-person-fill-add mr-1"></i>
                Accept
              </button>
              <button className="px-4 py-2 mr-2 shadow dark:bg-gray-800 dark:text-slate-200" onClick={handleRejectRequest}>
                <i className="bi bi-person-dash-fill mr-1"></i>
                Reject
              </button>
            </>
          )}
          {friendStatus === "strangers" && (
            <button className="px-4 py-2 mr-2 shadow dark:bg-gray-800 dark:text-slate-200" onClick={handleSentRequest}>
              <i className="bi bi-person-fill-add mr-1"></i>
              Add Friend
            </button>
          )}
          {friendStatus === "friends" && (
            <div className="relative" onClick={() => setDropRemove(!dropRemove)}>
              <button className="pl-4 pr-2 py-2 mr-2 shadow dark:bg-gray-800 dark:text-slate-200">
                <i className="bi bi-person-check-fill mr-1"></i>
                Friends<i class="bi bi-three-dots ml-2"></i>
              </button>
              {dropRemove && <div className="absolute right-2 top-11 bg-gray-50 shadow w-28 text-center hover:bg-gray-200">
                <button className="px-2 py-1 rounded" onClick={handleRemoveFriend}>Remove</button>
              </div>}
            </div>
          )}
          {!isCurrentUser && <button className="px-4 py-2 bg-blue-600 text-slate-50">
            <i className="bi bi-chat mr-1"></i>
            Message
          </button>}
        </div>
      </div>

      <div className="flex mt-8">
        <div className="sticky max-lg:hidden top-20 w-96 h-fit">
          <div>
            <div className="w-full h-fit shadow dark:shadow-gray-800 dark:shadow-sm flex flex-col justify-center items-center px-4 py-6 dark:text-gray-200">
              <span className="font-semibold mb-1">About Me</span>
              <span>{userDetails?.aboutMe}</span>
            </div>
          </div>
        </div>

        <div className="lg:ml-16 flex-1 h-[1000px] dark:bg-gray-900">
          {isCurrentUser && <CreatePost />}
          <div className="mt-12 flex flex-col gap-3">
            {posts.map((post) => (
              <PostCard post={post} key={post.id} />
            ))}
          </div>
          <div ref={observerRef} className="h-20 flex justify-center mb-10">
            <img src={loadingGif} alt="loading gif" className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

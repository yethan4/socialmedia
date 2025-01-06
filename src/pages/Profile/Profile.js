import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDocument } from '../../services/fetchDocument';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { CreatePost, FriendCard, PostCard} from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { addPosts, setLoading, setPosts } from '../../actions/postsAction';

import loadingGif from "../../assets/loading.gif";
import { useTitle } from '../../hooks/useTitle';
import { addFriend, checkFriendStatus, rejectFriendRequest, removeFriend, sentFriendRequest, undoFriendRequest } from '../../services/friendsService';
import { deleteImage, uploadImage } from '../../services/imageService';

export const Profile = () => {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("posts");
  const [userData, setUserData] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [friendStatus, setFriendStatus] = useState(null);
  const [friendRequestId, setFriendRequestId] = useState(null);
  const [dropRemove, setDropRemove] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [bgImg, setBgImg] = useState({
    file: null,
    url: "",
  })
  const [avatarImg, setAvatarImg] = useState({
    file: null,
    url: "",
  })
  const [isAboutMeEdit, setIsAboutMeEdit] = useState(false);
  const [textAboutMe, setTextAboutMe] = useState("");
  const [noMorePosts, setNoMorePosts] = useState(false);

  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.authState.userInfo);
  const posts = useSelector(state => state.postsState.posts);
  const lastVisible = useSelector(state => state.postsState.lastVisible);
  const loading = useSelector(state => state.postsState.loading);

  const scrollTargetRef = useRef();
  const observerRef = useRef(null);
  const aboutMeRef = useRef();

  const activeTabClass = "text-gray-800 py-2 px-6 border-b-2 cursor-pointer dark:text-slate-100";
  const tabClass = "text-gray-600 py-2 px-6 text-xl cursor-pointer dark:text-slate-300";

  useTitle(`- Profile`);

  //to be corrected
  const changeTab = (tabName) => {
    //scrollTo
    setActiveTab(tabName);
  };
  //

  const handleSentRequest= async () => {
    await sentFriendRequest(userInfo.id, id);
    setFriendStatus("pendingSent");
  };

  const handleRejectRequest = async() => {
    await rejectFriendRequest(userInfo.id, id, friendRequestId);
    setFriendStatus("strangers");
  };

  const handleAddFriend = async() => {
    await addFriend(userInfo.id, id, friendRequestId);
    setFriendStatus("friends");
  };

  const handleRemoveFriend = async() => {
    await removeFriend(userInfo.id, id);
    setFriendStatus("strangers");
  };

  const handleUndoRequest = async() => {
    await undoFriendRequest(userInfo.id, id, friendRequestId);
    setFriendStatus("strangers");
  };

  const handleBgImage = (event) => {
    if (event.target.files[0]){
      setBgImg({
        file: event.target.files[0],
        url: URL.createObjectURL(event.target.files[0]),
      })
    }
  };

  const handleAvatarImage = (event) => {
    if (event.target.files[0]){
      setAvatarImg({
        file: event.target.files[0],
        url: URL.createObjectURL(event.target.files[0]),
      })
    }
  };

  const handleCancelBgImg = () => {
    setBgImg({
      url: userDetails.bgImg || ""
    })
  };

  const handleCancelAvatarImg = () => {
    setAvatarImg({
      url: userDetails.bgImg || ""
    })
  };

  const handleSaveBgImg = async() => {
    setLoadingData(true)
    let imgUrl = "";
    
    try{

      if(bgImg.file){
        imgUrl = await uploadImage(bgImg.file); 
      }

      if(userDetails.bgImg) await deleteImage(userDetails.bgImg);
  
      const docRef = doc(db, "userDetails", userInfo.id);
  
      await updateDoc(docRef, {
        bgImg: imgUrl 
      });
      console.log(imgUrl)
  
      setBgImg({ file: "", url: imgUrl });
      setUserDetails(prevState => ({
        ...prevState,
        bgImg: imgUrl,
      }));
    }catch(err){
      console.log(err);
    }finally{
      setLoadingData(false)
    }
  };

  const handleSaveAvatarImg = async() => {
    setLoadingData(true);
    console.log(avatarImg);
    let imgUrl = "";
    
    try{

      if(avatarImg.file){
        imgUrl = await uploadImage(avatarImg.file); 
      }

      
      if(userInfo.avatar != "https://firebasestorage.googleapis.com/v0/b/positx-ca63d.appspot.com/o/default%2FdefaultAvatar.png?alt=media&token=ee889b87-bcf3-4d04-9c4c-4746570793d9"){ 
        await deleteImage(userInfo.avatar);
      }
  
      const docRef = doc(db, "users", userInfo.id);
  
      await updateDoc(docRef, {
        avatar: imgUrl 
      });
      console.log(imgUrl)
  
      setAvatarImg({ file: "", url: "" });
    }catch(err){
      console.log(err);
    }finally{
      setLoadingData(false)
    }
  };

  const handleChangeAboutMe = (event) => {
    setTextAboutMe(event.target.value);
  };

  const handleSaveAboutMe = async() => {
    setLoadingData(true);
    try{

      const docRef = doc(db, "userDetails", userInfo.id);

      await updateDoc(docRef, {
        aboutMe: textAboutMe
      });
      setUserDetails(prevState => ({
        ...prevState,
        aboutMe: textAboutMe
      }));

      setIsAboutMeEdit(false);

    }catch(err){
      console.log(err);
    }finally{
      setLoadingData(false);
    }
  };

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
        setBgImg({ file: "", url: details?.bgImg ? details.bgImg : "" });
        setTextAboutMe(details?.aboutMe ? details.aboutMe : "");
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
  }, [id, dispatch]);

  const loadMorePosts = async () => {
    if (!lastVisible) {
      setNoMorePosts(true);
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
        setNoMorePosts(true);
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
  }, [lastVisible, loading, loadMorePosts]);

  useEffect(() => {
    const checkStatus = async() => {
      const {status, requestId} = await checkFriendStatus(userInfo, id);
      setFriendStatus(status);
      setFriendRequestId(requestId)
    }

    if(userInfo && id && !isCurrentUser){
      checkStatus()
    }
  }, [userInfo, id, isCurrentUser]);

  useEffect(() => {
    const textarea = aboutMeRef.current;
    if (textarea) {
        textarea.style.height = "auto"; 
        textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  }, [textAboutMe, isAboutMeEdit]); 

  return (
    <div className="mt-16 w-full max-w-[1200px] h-full mx-auto rounded-lg">
      <div className="relative shadow-lg dark:shadow-gray-800 dark:shadow-sm rounded-lg max-lg:pb-8">
        <div 
          className="relative h-[35vh] bg-cover bg-center border-b" 
          key={bgImg.url} 
          style={{ backgroundImage: `url(${bgImg.url})` }}
        >
        {isCurrentUser && (
          <>
            <input type="file" id="bgImg" className="hidden" onChange={handleBgImage} />
            <label
              htmlFor="bgImg"
              className="flex items-center bg-gray-100 ml-1 w-40 py-2 px-2 opacity-30 rounded cursor-pointer hover:opacity-70 dark:bg-gray-600 dark:text-slate-50"
            >
              Change Photo
              <i className="ml-1 bi bi-pencil-square"></i>
            </label>
            {bgImg?.file && (
            <div className="absolute top-0 right-0">
              <button 
                className="bg-green-400 text-white px-2 py-2 opacity-50 hover:opacity-70"
                onClick={handleSaveBgImg}
                disabled={loadingData}
              >
                Save
              </button>
              <button 
                className="bg-gray-400 text-white px-2 py-2 opacity-50 hover:opacity-70"
                onClick={handleCancelBgImg}
                disabled={loadingData}
              >
                Cancel
              </button>
            </div>
            )}
          </>
        )}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              {isCurrentUser ? (
                <img
                  src={avatarImg.url ? avatarImg.url : userInfo.avatar}
                  alt="User Avatar"
                  className="w-48 h-48 rounded-full border-4 border-white object-cover"
                />
              ) : (
              <img
                src={userData?.avatar}
                alt="User Avatar"
                className="w-48 h-48 rounded-full border-4 border-white object-cover"
              />)}
              {isCurrentUser && (
                <div>
                  <input type="file" id="avatarImg" className="hidden" onChange={handleAvatarImage} />
                  <label 
                    className="absolute bottom-4 right-4 max-sm:px-3 max-sm:py-2 px-2 py-1 bg-gray-700 text-slate-50 rounded-full hover:bg-gray-500 cursor-pointer"
                    htmlFor="avatarImg"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </label>
                  {avatarImg.file && (
                    <div className="absolute top-48 right-16">
                      <button 
                        className="bg-green-400 text-white px-2 py-2 opacity-100 hover:bg-green-500"
                        onClick={handleSaveAvatarImg}
                        disabled={loadingData}
                      >
                        <i className="bi bi-check2"></i>
                      </button>
                      <button 
                        className="bg-gray-400 text-white px-2 py-2 opacity-100 hover:bg-gray-500"
                        onClick={handleCancelAvatarImg}
                        disabled={loadingData}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
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
                Friends<i className="bi bi-three-dots ml-2"></i>
              </button>
              {dropRemove && <div className="absolute right-2 top-11 bg-gray-50 shadow w-28 text-center hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-700">
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

      <div className="flex mt-8 max-lg:flex-col">
        <div className="lg:sticky top-20 w-96 h-fit max-lg:m-auto max-lg:mb-4">
          <div className="w-full h-fit shadow dark:shadow-gray-800 dark:shadow-sm flex flex-col justify-center items-center px-4 py-6 dark:text-gray-200">
            <div className="font-semibold mb-1">
              <span>About Me</span>
              {isCurrentUser && !isAboutMeEdit && <button className="max-sm:px-3 max-sm:py-2 px-2 py-1 ml-2 bg-gray-700 text-slate-50 rounded-full hover:bg-gray-500" onClick={() => setIsAboutMeEdit(true)}><i className="bi bi-pencil-square" ></i></button>}
            </div>
            {!isAboutMeEdit && (<span>{userDetails?.aboutMe}</span>)}
            {isAboutMeEdit && (
              <>
              <textarea
                value={textAboutMe}
                onChange={handleChangeAboutMe}
                ref={aboutMeRef}
                className="block h-10 max-h-[60vh] w-full resize-none border-0 outline-none py-2 rounded bg-gray-100 dark:text-gray-100 dark:bg-gray-700 overflow-y-auto dark-scrollbar always-scrollbar text-center"
              >
              </textarea>
              <div className="mt-4 flex gap-1 justify-center">
                <button className="px-4 py-1 hover:bg-gray-50" onClick={handleSaveAboutMe} >Save</button>
                <button className="px-4 py-1 hover:bg-gray-50" onClick={() => setIsAboutMeEdit(false)}>Cancel</button>
              </div>
              </>
            )}
          </div>
        </div>

        <div className="lg:ml-16 flex-1 dark:bg-gray-900">

          <div className="z-40 sticky top-14 pt-2 mb-2 bg-white border-b-2 flex justify-center text-2xl font-semibold dark:bg-gray-900 dark:border-gray-700">
            <div className={activeTab==="posts" ? activeTabClass : tabClass} onClick={() => changeTab("posts")}>Posts</div>
            <div className={activeTab==="friends" ? activeTabClass : tabClass}  onClick={() => changeTab("friends")}>Friends({userData?.friends.length})</div>
          </div>
          <div ref={scrollTargetRef} className="w-full h-2"></div>
         {activeTab==="posts" ? (
          <section>
            {isCurrentUser && <CreatePost />}
            <div className="mt-0 flex flex-col gap-3 pb-10">
              {posts.map((post) => (
                <PostCard post={post} key={post.id} />
              ))}
            </div>
            {!noMorePosts && (
              <div ref={observerRef} className="h-20 flex justify-center mb-10">
                <img src={loadingGif} alt="loading gif" className="h-8" />
              </div>
            )}
          </section>
        ) : (
          <section className="flex gap-x-4 h-[100vh] justify-center gap-y-2  sm:flex-wrap pb-16 ">
            {
              userData?.friends && 
              userData.friends.map((friendId) =>( 
                <FriendCard key={friendId} friendId={friendId} />
              ))
            }
          </section>
        )}
        </div>
      </div>
    </div>
  );
};

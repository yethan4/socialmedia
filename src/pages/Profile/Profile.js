import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDocument, updateDocument } from '../../services/generalService';
import { AvatarImage, ConfirmBox, CreatePost, FriendCard, InfiniteScrollObserver, PostCard} from '../../components';
import { useSelector } from 'react-redux';

import { useTitle } from '../../hooks/useTitle';
import { deleteImage, uploadImage } from '../../services/imageService';
import { createNewChat } from '../../services/chatService';
import { useFriendStatus } from '../../hooks/useFriendStatus';
import { useImageLoader } from '../../hooks/useImageLoader';
import { usePosts } from '../../hooks/usePosts';
import { blockUser } from '../../services/usersService';
import { useBlockStatus } from '../../hooks/useBlockStatus';

export const Profile = () => {
  const { id } = useParams();

  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [userData, setUserData] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
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
  const [dropMenu, setDropMenu] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { blockStatus }= useBlockStatus(id)

  const { imageLoaded, handleLoadImage } = useImageLoader();

  const navigate = useNavigate();
  const currentUser = useSelector(state => state.authState.userInfo);
  const posts = useSelector(state => state.postsState.posts);
  const loading = useSelector(state => state.postsState.loading);

  const scrollTargetRef = useRef();
  const aboutMeRef = useRef();

  const activeTabClass = "text-gray-800 py-2 px-6 border-b-2 cursor-pointer dark:text-slate-100";
  const tabClass = "text-gray-600 py-2 px-6 text-xl cursor-pointer dark:text-slate-300";

  useTitle(`- Profile`);

  const {
      friendStatus,
      dropRemove,
      setDropRemove,
      handleSentRequest,
      handleRejectRequest,
      handleAddFriend,
      handleRemoveFriend,
      handleUndoRequest
    } = useFriendStatus(id);

  const {
    noMorePosts,
    loadMorePosts
  } = usePosts("userPosts", {userId:id, friendStatus:friendStatus})

  //to be corrected
  const changeTab = (tabName) => {
    //scrollTo
    setActiveTab(tabName);
  };
  //

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

      await updateDocument("userDetails", currentUser.id, {bgImg: imgUrl});
  
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

      
      if(currentUser.avatar !== "https://firebasestorage.googleapis.com/v0/b/positx-ca63d.appspot.com/o/default%2FdefaultAvatar.png?alt=media&token=ee889b87-bcf3-4d04-9c4c-4746570793d9"){ 
        await deleteImage(currentUser.avatar);
      }
  
      await updateDocument("users", currentUser.id, {avatar: imgUrl });
  
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
      await updateDocument("userDetails", currentUser.id, {aboutMe: textAboutMe});

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

  const handleMessage = async () => {
    await createNewChat(currentUser.id, userData.id);
    
    navigate(`/chats/${userData.id}`)
  }


  useEffect(() => {
    if (id === currentUser.id) {
      setIsCurrentUser(true);
    } else {
      setIsCurrentUser(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    if (!id) return

    const fetchUser = async() => {
      const user = await fetchDocument(id, "users");
      setUserData(user);
    }

    fetchUser();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchUserDetails = async () => {
      const details = await fetchDocument(id, "userDetails");

      if (details) {
        setUserDetails(details);
        setBgImg({ file: "", url: details.bgImg || "" });
        setTextAboutMe(details.aboutMe || "");
      }
    };

    fetchUserDetails();
  }, [id])

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
          style={{ backgroundImage: imageLoaded && !blockStatus.isCuBlocked && !blockStatus.hasCuBlocked  ? `url(${bgImg.url})` : 'none', }}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
          )}
          <img
            src={bgImg.url}
            alt="background"
            className="hidden" 
            onLoad={handleLoadImage} 
          />

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
                  src={avatarImg.url ? avatarImg.url : currentUser.avatar}
                  alt="User Avatar"
                  className="w-48 h-48 rounded-full border-4 border-white object-cover"
                />
              ) : (

             ( !blockStatus.isCuBlocked ? (
              <AvatarImage src={userData?.avatar} size={48}/> 
             ) : (
              <div className="w-48 h-48 rounded-full border-2 border-white bg-gray-300 dark:bg-gray-700 dark:bg-gray-600"/>
             )
               )

              )}
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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{!blockStatus.isCuBlocked ? userData?.username : "You are blocked"}</h2>
        </div>
        
        <div className="flex max-lg:justify-center absolute bottom-2 left-1 right-1">

          
  {!blockStatus.isCuBlocked && !blockStatus.hasCuBlocked && (
    <>
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
          {dropRemove && (
            <div className="absolute right-2 top-11 bg-gray-50 shadow w-28 text-center hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-700">
              <button className="px-2 py-1 rounded" onClick={() => setShowConfirmation("remove")}>
                Remove
              </button>
            </div>
          )}
        </div>
      )}
      {!isCurrentUser && (
        <button className="px-4 py-2 bg-blue-600 text-slate-50" onClick={handleMessage}>
          <i className="bi bi-chat mr-1"></i>
          Message
        </button>
      )}
    </>
  )}
  <div className="relative ml-auto flex items-center">
    {!isCurrentUser && !blockStatus.isCuBlocked && (
      <>
        <button 
          className="h-fit px-1 text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => setDropMenu(!dropMenu)}
        >
          <i className="bi bi-three-dots-vertical"></i>
        </button>
        {dropMenu && (
          <div className="absolute top-8 right-0">
            {!blockStatus.hasCuBlocked ? (
              <button 
                className="flex items-center justify-center w-full pl-3 pr-4 py-2 text-lg bg-red-500 dark:bg-red-600 text-white hover:bg-red-400 dark:hover:bg-red-500 whitespace-nowrap rounded-xl"
                onClick={() => {
                  setShowConfirmation("block");
                  setDropMenu(false);
                }}  
              >
                <i className="bi bi-ban mr-1"></i> Block {userData?.username}
              </button>
            ) : (
              <button 
                className="flex items-center justify-center w-full pl-3 pr-4 py-2 text-lg bg-gray-600 dark:bg-gray-700 text-gray-50 hover:bg-gray-500 dark:hover:bg-gray-500 whitespace-nowrap rounded-xl"
                onClick={() => {
                  setShowConfirmation("block");
                  setDropMenu(false);
                }}  
              >
                <i className="bi bi-ban mr-1"></i> Unblock {userData?.username}
              </button>
            )}
          </div>
        )}
      </>
    )}
  </div>
</div>


      </div>

      <div className="flex mt-8 max-lg:flex-col">
        <div className="lg:sticky top-20 w-96 h-fit max-lg:m-auto max-lg:mb-4">
          {!blockStatus.isCuBlocked && !blockStatus.hasCuBlocked && (<div className="w-full h-fit shadow dark:shadow-gray-800 dark:shadow-sm flex flex-col justify-center items-center px-4 py-6 dark:text-gray-200">
            <div className="font-semibold mb-1">
              <span>About Me</span>
              {isCurrentUser && !isAboutMeEdit && <button className="max-sm:px-3 max-sm:py-2 px-2 py-1 ml-2 bg-gray-700 text-slate-50 rounded-full hover:bg-gray-500" onClick={() => setIsAboutMeEdit(true)}><i className="bi bi-pencil-square" ></i></button>}
            </div>
            {!isAboutMeEdit && (<div className="whitespace-pre-wrap text-center w-full">{userDetails?.aboutMe}</div>)}
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
          </div>)}
        </div>

        {!blockStatus.isCuBlocked && !blockStatus.hasCuBlocked && (<div className="lg:ml-16 flex-1 dark:bg-gray-900">

          <div className="z-40 sticky top-14 pt-2 mb-2 bg-white border-b-2 flex justify-center text-2xl font-semibold dark:bg-gray-900 dark:border-gray-700">
            <div className={activeTab==="posts" ? activeTabClass : tabClass} onClick={() => changeTab("posts")}>Posts</div>
            <div className={activeTab==="friends" ? activeTabClass : tabClass}  onClick={() => changeTab("friends")}>Friends({userData?.friends.length})</div>
          </div>
          <div ref={scrollTargetRef} className="w-full h-2"></div>
         {activeTab==="posts" ? (
          <section>
            {isCurrentUser && <CreatePost />}
            <div className="mt-0 flex flex-col gap-3 pb-10">
              {posts.length>0 && posts.map((post) => (
                <PostCard post={post} key={post.id} />
              ))}
              {posts.length === 0 && noMorePosts && (
                <span className="px-10 py-4 text-xl rounded w-full text-center dark:text-slate-50">{userData?.username} doesn't have any posts yet</span>
              )}
            </div>
            <InfiniteScrollObserver 
              loadMore={loadMorePosts} 
              loading={loading} 
              hasMore={!noMorePosts} 
            />
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
        </div>)}
      </div>

      {showConfirmation==="remove" && (
        <ConfirmBox 
          question={`Are you sure you want to remove ${userData.username} from friends?`}
          answers={["Remove", "Cancel"]}
          handleYes={() => {
            handleRemoveFriend();
            setShowConfirmation(false);
          }}
          handleNo={() => setShowConfirmation(false)}
        />
      )}

      {showConfirmation==="block" && (
        <ConfirmBox 
          question={`Are you sure you want to block ${userData.username}?`}
          answers={["Block", "Cancel"]}
          handleYes ={() =>{
            blockUser(currentUser.id, id);
            setShowConfirmation(false);
          }}
          handleNo={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

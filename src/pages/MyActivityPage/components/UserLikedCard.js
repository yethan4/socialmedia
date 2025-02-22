import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { fetchDocument } from "../../../services/oneDocumentService";
import { Link } from "react-router-dom";
import { formatTimeAgo } from "../../../utils/timeUtils";
import { useLikes } from "../../../hooks/useLikes";
import { AvatarImage } from "../../../components";

export const UserLikeCard = ({like}) => {
  const [postAuthorData, setPostAuthorData] = useState([]);

  const currentUser = useSelector(state => state.authState.userInfo);

  const { 
    likeId, 
    handleLike, 
    handleDislike
  } = useLikes(like.postId, currentUser.id, postAuthorData?.id);

  const formattedTime = formatTimeAgo(like.timestamp.seconds);

  useEffect(() => {
    const fetchAuthorData = async() => {
      try{
        let postAuthorId = ""
        await fetchDocument(like.postId, "posts").then((post) => {
          postAuthorId = post.authorId
        })

        await fetchDocument(postAuthorId, "users").then((user) => {
          setPostAuthorData(user);
        })
      }catch(err){
        console.log(err)
      }
    }

    fetchAuthorData();
    
  }, [like.postId])


  return (
    <div className="relative flex flex-col pt-2 pl-2 pr-12 shadow dark:shadow-gray-700">
      <span className="mb-2 font-medium text-sm text-gray-700 dark:text-slate-200">{formattedTime}</span>
      <div className="flex items-center dark:text-slate-50">
        <AvatarImage src={postAuthorData?.avatar} size="12" />
        <span className="ml-3"><b>{currentUser?.username}</b> liked <b>{postAuthorData?.username}</b>'s post</span>
      </div>
      <Link to={`/post/${like?.postId}`}>
      <div className="text-sm pt-2 px-2 w-fit my-2 cursor-pointer dark:text-slate-50 underline">
        Show Post
      </div>
      </Link>
      <span 
        className="absolute right-5 top-11 cursor-pointer hover:scale-110 dark:text-slate-50" 
        onClick={likeId ? () => handleDislike() : () => handleLike()}
      >
        {likeId ? (
          <i className="bi bi-heart-fill text-2xl text-red-600"></i>
        ) : (
          <i className="bi bi-heart text-2xl"></i>
        )}
      </span>
    </div>
  )
}

export const setLoading = (loading) =>{
  return {
    type: "SET_LOADING",
    payload: loading
  }
}

export const setPosts = (posts, lastVisible) => {
  return{
    type: "SET_POSTS",
    payload: {
      posts,
      lastVisible
    }
  };
};

export const addPosts = (posts, lastVisible) => {
  return{
    type: "ADD_POSTS",
    payload: {
      posts,
      lastVisible
    }
  };
};

export const addNewPost = (post) => {
  return {
    type: "ADD_NEW_POST",
    payload: post,
  };
};

export const deletePost = (id) => {
  return{
    type: "DELETE_POST",
    payload: id,
  };
};

export const likePost = (postId) => {
  return{ 
    type: "LIKE_POST", 
    payload: postId,
  };
};

export const dislikePost = (postId) => {
  return{ 
    type: "DISLIKE_POST", 
    payload: postId,
  };
};
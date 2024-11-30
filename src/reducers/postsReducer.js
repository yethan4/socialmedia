const initialState = {
  posts: [],
  loading: false,
  error: null,
  lastVisible: null
};

export const postsReducer = (state = initialState, action) => {
  switch(action.type){
    case "SET_POSTS":
      return{
        ...state,
        posts: action.payload.posts,
        lastVisible: action.payload.lastVisible,
        loading: false,
      };
    case "ADD_POSTS":
      return{
        ...state,
        posts: [...state.posts, ...action.payload.posts],
        lastVisible: action.payload.lastVisible,
        loading: false,
      };
    case "SET_LOADING":
      return{
        ...state,
        loading: action.payload
      };
    case "ADD_NEW_POST":
      return {
        ...state,
        posts: [action.payload, ...state.posts], // Dodanie nowego posta na początku
      };
    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload)
      }
    case "LIKE_POST":
      return {
        ...state,
        posts: state.posts.map((post) => 
          post.id === action.payload 
          ? { ...post, likesCount: post.likesCount + 1} 
          : post
        ),
      }
    case "DISLIKE_POST":
      return {
        ...state,
        posts: state.posts.map((post) => 
          post.id === action.payload 
          ? { ...post, likesCount: post.likesCount - 1} 
          : post
        ),
      }
    case "CREATE_POST":
      return {
        ...state,
        posts: state.posts.map((post) => 
          post.id === action.payload 
          ? { ...post, commentsCount: post.likesCount + 1} 
          : post
        ),
      }
    default:
      return state;
  };
};

import { doc, getDoc} from "firebase/firestore";
import { useState } from "react"
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom"
import { auth, db } from "../firebase/config";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { login } from "../actions/authAction";

export const Login = () => {
  const [formData, setFromData] = useState({
    email: "",
    password: ""
  })

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFromData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    const email = formData.email;
    const password = formData.password;

    //VALIDATE INPUTS
    if(!email || !password ) return;


    try{
      
      const res = await signInWithEmailAndPassword(auth, email, password)

      if (!res || !res.user) {
        throw new Error("Invalid response from Firebase.");
      }

      //ADD USER DATA TO STORE
      const docRef = doc(db, "users", res.user.uid)
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()){
        dispatch(login(docSnap.data()));
      }else{
        throw new Error("no such user");
      }

      toast.success("You are now logged in.")

    }catch(err){
      toast.error(err.message)
    }
    

  }
  
  return (
    <form onSubmit={handleSubmit} className="w-full h-screen dark:bg-gray-800 pt-24">
      <div className="w-full h-screen dark:bg-gray-800 pt-24">
        <div className="relative mx-auto max-w-[400px] sm:shadow-lg h-[400px] flex flex-col px-6 dark:text-white md:dark:shadow-lg md:dark:shadow-gray-900">
          <span className="mx-auto text-2xl font-medium mt-6 mb-6">Login</span>
          <label htmlFor="email" className="text-lg">Email</label>
          <div className="relative">
            <input 
            type="text" 
            id="email"
            onChange={handleChange} 
            placeholder="Email"
            required 
            className="border-b w-full pl-8 py-3 outline-none dark:bg-gray-800"/>
            <i className="bi bi-person-circle absolute left-1 top-3 text-gray-400"></i>
          </div>
          
          <label htmlFor="email" className="mt-2 text-lg">Password</label>
          <div className="relative">
            <input 
            type="password" 
            id="password"
            onChange={handleChange} 
            placeholder="Password"
            required 
            className="border-b w-full pl-8 py-3 outline-none dark:bg-gray-800"/>
            <i className="bi bi-key-fill absolute left-1 top-3 text-gray-400"></i>
          </div>
          <button className="py-2 bg-blue-600 text-slate-100 mt-4 text-lg">Zaloguj</button>
          <Link to="/register" className="hover:underline bottom-4 absolute text-sm">Don't have an account?</Link>
        </div>
      </div>
    </form>
  )
}

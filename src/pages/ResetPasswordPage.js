import { useRef} from "react";
import { resetPassword } from "../services/authService";

export const ResetPasswordPage = () => {
  const emailRef = useRef();

  const handleSubmit = async(e) => {
    e.preventDefault();

    const email = emailRef.current.value

    await resetPassword(email)
    emailRef.current.value = ""
  }

  return (
    <form onSubmit={handleSubmit} className="w-full h-screen dark:bg-gray-800 pt-24">
      <div className="w-full h-screen dark:bg-gray-800 pt-24">
        <div className="relative mx-auto max-w-[400px] sm:shadow-lg h-[300px] flex flex-col px-6 dark:text-white md:dark:shadow-lg md:dark:shadow-gray-900">
          <span className="mx-auto text-2xl font-medium mt-6 mb-6 text-center">We’ll send a link<br />to your email.</span>
          <div className="relative">
            <input 
            ref={emailRef}
            type="text" 
            id="email"
            placeholder="Email"
            required 
            className="border-b w-full pl-8 py-3 outline-none dark:bg-gray-800"
            />
            <i className="bi bi-person-circle absolute left-1 top-3 text-gray-400"></i>
          </div>
          <button className="py-2 bg-blue-600 text-slate-100 mt-4 text-lg">Send</button>
        </div>
      </div>
    </form>
  )
}

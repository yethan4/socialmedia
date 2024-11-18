import { Link } from "react-router-dom"

export const Register = () => {

  return (
    <div className="w-full h-screen dark:bg-gray-800 pt-24">
      <div className="relative mx-auto max-w-[400px] sm:shadow-lg h-[560px] flex flex-col px-6 dark:text-white md:dark:shadow-lg md:dark:shadow-gray-900">
        <span className="mx-auto text-2xl font-medium mt-6 mb-6">Register</span>
        <label htmlFor="email" className="text-lg">Username</label>
        <div className="relative">
          <input type="text" id="email" placeholder="Email" className="border-b w-full pl-8 py-3 outline-none dark:bg-gray-800"/>
          <i class="bi bi-person-circle absolute left-1 top-3 text-gray-400"></i>
        </div>
        
        <label htmlFor="email" className="mt-2 text-lg">Email</label>
        <div className="relative">
          <input type="text" id="email" placeholder="Email" className="border-b w-full pl-8 py-3 outline-none dark:bg-gray-800"/>
          <i class="bi bi-person-circle absolute left-1 top-3 text-gray-400"></i>
        </div>
        
        <label htmlFor="email" className="mt-2 text-lg">Password</label>
        <div className="relative">
          <input type="password" id="password" placeholder="Password" className="border-b w-full pl-8 py-3 outline-none dark:bg-gray-800"/>
          <i class="bi bi-key-fill absolute left-1 top-3 text-gray-400"></i>
        </div>

        <label htmlFor="email" className="mt-2 text-lg">Repeat Password</label>
        <div className="relative">
          <input type="password" id="password" placeholder="Repeat Password" className="border-b w-full pl-8 py-3 outline-none dark:bg-gray-800"/>
          <i class="bi bi-key-fill absolute left-1 top-3 text-gray-400"></i>
        </div>
        <button className="py-2 bg-blue-600 text-slate-100 mt-4 text-lg">Sign Up</button>
        <Link to="/login" className="hover:underline bottom-4 absolute text-sm">Already have an account?</Link>
      </div>
    </div>
  )
}

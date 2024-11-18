import { Routes, Route } from "react-router-dom";
import { Home, Login, Register } from "../pages";

export const AllRoutes = () => {
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

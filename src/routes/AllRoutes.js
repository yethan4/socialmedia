import { Routes, Route } from "react-router-dom";
import { Home, Login, Register, Profile } from "../pages";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

export const AllRoutes = () => {
  
  return (
    <Routes>
      {/* logged in only  */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* logged out only */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    </Routes>
  )
}

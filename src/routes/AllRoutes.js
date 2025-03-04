import { Routes, Route } from "react-router-dom";
import { Home, Login, Register, Profile, PostPage, NotificationsPage, FriendsPage, SettingsPage, PageNotFound, MyActivityPage, BookmarksPage, ChatsPage, ResetPasswordPage } from "../pages";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { Layout } from "../components";

export const AllRoutes = () => {
  
  return (
    <Routes>
      {/* logged in only  */}
      <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/post/:id" element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
      <Route path="/chats" element={<ProtectedRoute><ChatsPage /></ProtectedRoute>} />
      <Route path="/chats/:id" element={<ProtectedRoute><ChatsPage /></ProtectedRoute>} />

      {/* with Sidebar */}
      <Route element={<Layout />}>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/my-activity"  element={<ProtectedRoute><MyActivityPage /></ProtectedRoute>} />
        <Route path="/my-activity/:section"  element={<ProtectedRoute><MyActivityPage /></ProtectedRoute>} />
      </Route>

      <Route path="/*" element={<ProtectedRoute><PageNotFound /></ProtectedRoute>} />

      {/* logged out only */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
    </Routes>
  )
}

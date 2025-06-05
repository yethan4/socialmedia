# SocialApp

[socialmedia-yethan.netlify.app](https://socialmedia-yethan.netlify.app/index.html)

**Test Account**  
**Login:** `test@test.com`  
**Password:** `test123`

---

## About

SocialApp is a social media application built for educational purposes, allowing users to publish posts, chat, and interact with one another.  
The project helped me develop my technical and cognitive skills, as well as understand full-stack development with modern frontend tools and Firebase as a backend.

---

## Technologies & Architecture

- **React:** Component-based UI development.
- **React Router:** Handles routing between pages (login, register, profile, chats, etc.).
- **Redux:** Manages global application state, including the current user, posts, notifications, chats, and their participants. This enables smooth updates and UI consistency across the app.
- **Firebase:** Provides backend functionality:
    - **Authentication:** Secure sign up, login, logout, and password recovery.
    - **Firestore:** Stores user data, posts, chats, notifications, and other app data.
    - **Storage:** For image/file uploads.
- **Tailwind CSS:** Utility-first CSS framework for fast, responsive, and modern UI design.
- **Toast Notifications:** Real-time feedback for user actions and errors.
- **Pagination:** Efficient loading of posts in pages, improving performance and user experience.

---

## Features

- **User Authentication:** Sign up, login, logout, and password recovery.
- **Posts:** Create, view, delete posts; control visibility.
- **Likes and Comments:** Like and comment on posts.
- **Friendship System:** Send, accept, or decline friend invitations; manage friend list.
- **Notification System:** In-app notifications for likes, comments, friend requests, and acceptances.
- **Toast Notifications:** Immediate feedback for user actions.
- **Online Status:** See friends' statuses in real time (chats).
- **Chat System:** Real-time chat, typing indicators, seen/unseen messages.
- **Settings:** Update password/username, manage notifications, bookmarks, and activity.
- **Block Users:** Block users globally or in chat.
- **Search for Friends:** Search bar to find and add friends.

---

## Screenshots

### 1. Home Screen
![Home Screen](https://github.com/yethan4/socialmedia/blob/main/screenshots/home.png)

### 2. Dark Home Screen
![Dark Home Screen](https://github.com/yethan4/socialmedia/blob/main/screenshots/homeDark.png)

### 3. Chats Screen
![Chats Screen](https://github.com/yethan4/socialmedia/blob/main/screenshots/chats.png)

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yethan4/socialmedia.git
   cd socialmedia
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**
   - Create a Firebase project.
   - Enable Authentication (Email/Password, Google, etc.).
   - Set up Firestore (and Storage if needed).
   - Add your Firebase config to a `.env` file:
     ```plaintext
     REACT_APP_FIREBASE_API_KEY=your-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=your-project-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     REACT_APP_FIREBASE_APP_ID=your-app-id
     ```

4. **Run project**
   ```bash
   npm start
   # or
   yarn start
   ```

---

## Notes

- This project uses the free tier of Firebase, including Firebase Storage for file uploads (e.g., profile photos, post images).
- **Starting from October 1, Firebase Storage will no longer be available in the free tier for this project.**  
  As a result, uploading and displaying images may stop working after that date, unless storage is migrated to another provider.
- The application is a prototype built for learning and portfolio purposes.

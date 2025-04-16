# SocialApp
[socialmedia-yethan.netlify.app](https://socialmedia-yethan.netlify.app/index.html)

**Test Account**<br>
**Login** `test@test.com`
**Password** `test123`

## Technologies Used

- **Frontend**: React, React Router, Redux
- **Backend**: Firebase
- **Styling**: Tailwind CSS

## Description

SocialApp is a social application that allows users to publish posts, chat, and interact with others. It was built for educational purposes, with the goal of helping me develop my technical and cognitive skills during its creation.

## SCREENS

Here are some screenshots of the app:

### 1. Home Screen

![Home Screen](https://github.com/yethan4/socialmedia/blob/main/screenshots/home.png)

### 2. Dark Home Screen

![Dark Home Screen](https://github.com/yethan4/socialmedia/blob/main/screenshots/homeDark.png)

### 3. Chats Screen

![Chats Screen](https://github.com/yethan4/socialmedia/blob/main/screenshots/chats.png)

## Features

- **User Authentication**: Sign up, login, logout and password recovery.
- **Posts**: Users can create, view, delete posts as well as control who can see them.
- **Likes and Comments**: Users can like and comment on posts.
- **Friendship System**: Users can send, accept, or decline friend invitations and manage their friend list.
- **Notification System**: Users receive notifications when someone likes or comments on their posts, as well as when they receive a friend request or when a friend request is accepted. This ensures users stay updated on interactions and connections within the app.
- **Toast Notifications**: Users receive short notifications to confirm their actions.
- **Online Status**: Users can see the real-time presence of their friends or other users in chats.
- **Chat System**: Users can chat with each other, see when their chat partner is typing, and know whether thei messages have been seen or not.
- **Settings**: Users can update their password and username, manage their notifications, view their bookmarks, and track their activity.
- **Block Users**: Users can block other users, either across the entire app or just within the chat.
- **Search for Friends**: Users can search for other users using a search bar to find and connect with friends.

## Installation

Follow these steps to set up the application locally:

  1. **Clone the repository**
  
  In the project directory, you can run:
  
  ```bash
  git clone https://github.com/yethan4/socialmedia.git
  cd socialmedia
  ```
  
  2. **Install Dependencies**
  
  If you're using npm:
  ```bash
  npm install
  ```
  
  If you're using yarn:
  ```bash
  yarn install
  ```
  
  3. **Set up Firebase**
  
  Create a new project in the Firebase Console.
  Set up Firebase Authentication and enable sign-in methods (e.g., Email/Password, Google).
  Set up Firebase Firestore (or Realtime Database, depending on your app's structure).
  Add your Firebase config to the project. You can find your Firebase config in the Firebase Console under Project settings -> General -> Your apps.
  
  In the React app, create a .env file in the root directory and add your Firebase configuration:
  
  ```plaintext
  REACT_APP_FIREBASE_API_KEY=your-api-key
  REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
  REACT_APP_FIREBASE_PROJECT_ID=your-project-id
  REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
  REACT_APP_FIREBASE_APP_ID=your-app-id
  ```
  
  4. **Run project**
  
  Using npm:
  ```bash
  npm start
  ```
  
  Using yarn:
  ```bash
  yarn start
  ```

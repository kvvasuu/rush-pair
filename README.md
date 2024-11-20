
# RushPair <img src="https://raw.githubusercontent.com/kvvasuu/rush-pair/main/frontend/public/favicon.ico" alt="icon" width="24"/>

![App demo](https://raw.githubusercontent.com/kvvasuu/rush-pair/main/demo.png "App demo")

## :globe_with_meridians: General info

RushPair is an exciting speed friending app that brings people together for real-life interactions. Meet new people in a fun, fast-paced environment where anonymity is key. Each round, you’ll have 3 minutes to chat with a randomly selected partner. If you both click, the match is revealed at the end of the game. Discover connections naturally, one conversation at a time.

The application has been deployed on Render - https://rush-pair-front.onrender.com.

Use these login credentials to fully test the application with dummy data, etc.:

Login: test@test.com

Password: 222222

#### Keep in mind that the application is still in the development phase and currently has only a few features.
#### Additionally, because it is deployed on the free Render plan, the server goes to sleep and when trying to wake it up, the first request may take longer (up to a minute), give it a moment.

## :eight_pointed_black_star: Features:

#### Registration and Login System :closed_lock_with_key: 

The app provides secure user registration and login functionality, using an API built with **Express.js**. Users can create accounts, log in, and manage their sessions easily.

#### Profile Settings :raising_hand:

Users can fully customize their profiles, including:
- Changing their profile picture
- Editing personal details (name, email, etc.)
- Updating their profile description

#### App Settings :wrench:

Users can personalize app settings such as:
- **Notification preferences**: Enable or disable notifications.
- **Dark/Light mode**: Switch between dark and light themes.

#### Account Deletion :x:

Users can permanently delete their accounts and remove all associated data from the system.

#### Live Chat :mailbox_with_mail:

The app supports real-time chat with the following features:
- **Anonymous or revealed chats**: Chats can be anonymous or users can reveal their identities.
- **Customizable nicknames**: Users can set a nickname for their chat partner.
- **Profile details**: Users can view their chat partner’s details, including photo, description, and personal information.

#### Backend :computer:

The app uses **MongoDB** and **Mongoose** for database management, ensuring secure and efficient data storage. The API handles user authentication, profile management, and real-time chat functionalities.

#### More coming soon...



## Technologies:

- Typescript
- Vue (Composition API, Router)
- Pinia
- Node.js + Express.js
- MongoDB, Mongoose
- socket.io
- Photoshop, Illustrator
- FontAwesome

## Setup

Before you run app you need to set up envioronmental variables which are URLs used by app. Of course theese variables are not part of this repository since one of them - MongoDB URL - is secret and should not be exposed.

Create .env file in frontend folder with variable called "VITE_SERVER_URL" e.g. "VITE_SERVER_URL=http://localhost:3000" which is backend server URL - default "http://localhost:3000".

Create .env file in backend folder with variable called "MONGODB_KEY" e.g.:
```
mongodb+srv://RushPairUser:<db_password>@rushpair.jt6i9.mongodb.net/?retryWrites=true&w=majority&appName=Rushpair
```
which is MongoDB URL. If you want to run this app you should connect to your MongoDB database.

This repository is using Concurrently to run both frontend and backend at the same time with one npm script - "start": 
```
concurrently \"npm run dev --prefix frontend\" \"npm run dev --prefix backend\"
```
so there is no need to run them separately. Just use "npm run start" in main package folder.


```
# install dependencies
npm install

# serve with hot reload at localhost:5173
npm run start // run both frontend and backend with concurrently 
```

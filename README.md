
# RushPair <img src="https://raw.githubusercontent.com/kvvasuu/rush-pair/main/frontend/public/favicon.ico" alt="icon" width="24"/>

![App demo](https://raw.githubusercontent.com/kvvasuu/rush-pair/main/demo.png "App demo")

## :globe_with_meridians: General info

RushPair is an exciting speed friending app that brings people together for real-life interactions. Meet new people in a fun, fast-paced environment where anonymity is key. Each round, you’ll have 3 minutes to chat with a randomly selected partner. If you both click, the match is revealed at the end of the game. Discover connections naturally, one conversation at a time.

## :eight_pointed_black_star: Features:

...

## Getting Started

...

## Technologies:

- Typescript
- Vue (Composition API, Router)
- Pinia
- Node.js + Express.js
- MongoDB
- Photoshop, Illustrator
- FontAwesome

## Setup

Before you run app you need to set up envioronmental variables which are URLs used by app. Of course theese variables are not part of this repository since one of them - MongoDB URL - is secret and should not be exposed.

Create .env file in frontend folder with variable called "VITE_SERVER_URL" e.g. "VITE_SERVER_URL=http://localhost:3000" which is backend server URL - default "http://localhost:3000".

Create .env file in backend folder with variable called "MONGODB_KEY" e.g. "mongodb+srv://RushPairUser:<db_password>@rushpair.jt6i9.mongodb.net/?retryWrites=true&w=majority&appName=Rushpair" which is MongoDB URL. If you want to run this app you should connect to your MongoDB database.

This repository is using Concurrently to run both frontend and backend at the same time with one npm script - "start": "concurrently \"npm run dev --prefix frontend\" \"npm run dev --prefix backend\"", so there is no need to run them separately. Just use "npm run start" in main package folder.

```
# install dependencies
npm install

# serve with hot reload at localhost:5173
npm run start // run both frontend and backend with concurrently 
```

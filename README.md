# 💬 Whisp

**Whisp** is a full-stack real-time messaging application built with **Express**, **React**, **Prisma**, and **PostgreSQL**. It allows users to communicate seamlessly — whether through direct messages, group chats, or file sharing — all in an elegant, responsive interface.

[LIVE DEMO](https://whisp-front-end-production.up.railway.app/login).

---

## 🚀 Features

- 🧑‍💻 **User Profiles** — Sign up, edit profile details, and upload a profile picture.
- 💬 **Direct Messaging** — Send and receive messages in real time with other users.
- 👥 **Group Chats** — Create and manage group conversations with multiple users.
- 📎 **File Sharing** — Send and receive files (images, documents, etc.) in chats.
- 🕓 **Real-Time Updates** — Enjoy instant message delivery and live chat updates.
- 🔒 **Authentication** — Secure login and registration with hashed passwords.

---

## 🧩 Tech Stack

| Layer            | Technology                                     |
| ---------------- | ---------------------------------------------- |
| **Frontend**     | React (Vite), TailwindCSS (optional)           |
| **Backend**      | Node.js, Express                               |
| **Database**     | PostgreSQL with Prisma ORM                     |
| **Auth**         | Express sessions / JWT (depending on setup)    |
| **File Storage** | Local storage or cloud provider (e.g., AWS S3) |
| **Real-Time**    | WebSockets / Socket.IO                         |

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

- git clone https://github.com/yourusername/whisp.git
- cd whisp

### 2. Install Dependencies

Backend-end:

- cd server
- npm install

Front-End:

- cd client
- npm install

### 3. Set Up Environment Variables

Back-End:

- cd server
- Create .env file based on .env.example

Front-End:

- cd client
- Create .env file based on .env.example

### 4. Initialize Prisma & Database

- npx prisma migrate dev --name init
- npx prisma generate

### 5. Run the App

- inside root run "npm run dev"

## 🧠 Possible Future Improvements

- ✅ Message notifications
- ✅ Typing indicators
- ✅ Message reactions / emojis
- ✅ Push notifications

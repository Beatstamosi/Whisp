import { createBrowserRouter } from "react-router-dom";
import RequireAuth from "./Authentication/RequireAuth";
import App from "../App";
import Home from "./Home/Home";
import ChatPage from "./ChatPage/ChatPage";
import EditProfile from "./EditProfile/EditProfile";
import ViewProfile from "./ViewProfile/ViewProfile";
import Login from "./Authentication/Login/Login";
import SignUp from "./Authentication/Sign Up/SignUp";
import ErrorPage from "./ErrorPage/ErrorPage";
import ChatListPage from "./ChatListPage/ChatListPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          { index: true, element: <ChatListPage /> },
          { path: "chat/:chatId", element: <ChatPage /> },
        ],
      },
      {
        path: "edit-profile/:userId",
        element: <EditProfile />,
      },
      {
        path: "profile/:userId",
        element: <ViewProfile />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/error", element: <ErrorPage /> },
]);

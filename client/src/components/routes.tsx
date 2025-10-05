import App from "../App";
import ErrorPage from "./ErrorPage/ErrorPage.jsx";
import Login from "./Authentication/Login/Login.jsx";
import SignUp from "./Authentication/Sign Up/SignUp.jsx";
import RequireAuth from "./Authentication/RequireAuth.jsx";
import Home from "./Home/Home.js";
import EditProfile from "./EditProfile/EditProfile.js";

const routes = [
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
        index: true,
        element: <Home />,
      },
      {
        path: "edit-profile/:userId",
        element: <EditProfile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/error",
    element: <ErrorPage />,
  },
];

export default routes;

import { useAuth } from "../useAuth.jsx";
import { useNavigate } from "react-router-dom";
import useSocket from "../../../hooks/useSocket.js";

function useLogOut() {
  const { setUser, user } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket().current;

  const logOutHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/${user?.id}/logout`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      if (res.ok) {
        if (socket) {
          socket.emit("leave-user-room", user?.id);
        }
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
      }
    } catch (err) {
      console.error("Error logging out", err);
      navigate("/error");
    }
  };

  return logOutHandler;
}

export default useLogOut;

import { useAuth } from "../useAuth.jsx";
import { useNavigate } from "react-router-dom";

function useLogOut() {
  const { setUser, user } = useAuth();
  const navigate = useNavigate();

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

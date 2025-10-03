import { useAuth } from "../useAuth.jsx";
import { useNavigate } from "react-router-dom";

function useLogOut() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const logOutHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    localStorage.removeItem("token");

    setUser(null);

    navigate("/");
  };

  return logOutHandler;
}

export default useLogOut;

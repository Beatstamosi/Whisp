import style from "./NavBar.module.css";
import { useAuth } from "../Authentication/useAuth";
import { Link } from "react-router-dom";
import logo from "../../assets/whisp_logo.png";
import DropdownMenu from "../DropDownMenu/DropDownMenu";

function NavBar() {
  const { user, loading } = useAuth();

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className={style.containerNavBar}>
      <div className={style.containerLogo}>
        <Link to="/">
          <img src={logo} className={style.logo}></img>
        </Link>
      </div>
      <div>
        <DropdownMenu userId={user.id} />
      </div>
    </div>
  );
}

export default NavBar;

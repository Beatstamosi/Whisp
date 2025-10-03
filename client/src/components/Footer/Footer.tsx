import { FaGithub } from "react-icons/fa6";
import { Link } from "react-router-dom";
import style from "./Footer.module.css";

function Footer() {
  return (
    <div className={style.footer}>
      <Link to="https://github.com/Beatstamosi" className={style.link}>
        <FaGithub size="1.5em" className={style.icon} />
        <span>Moritz Bormann</span>
      </Link>
    </div>
  );
}

export default Footer;

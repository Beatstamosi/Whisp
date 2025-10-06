import style from "./Home.module.css";
import { Outlet, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import ChatListPage from "../ChatListPage/ChatListPage";

function Home() {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const location = useLocation();
  const viewingChat = location.pathname.startsWith("/chat/");

  if (isDesktop) {
    return (
      <div className={style.homeLayoutWrapper}>
        <div className={style.chatList}>
          <ChatListPage />
        </div>
        <div className={style.chatPage}>
          <Outlet />
        </div>
      </div>
    );
  }

  return <div>{viewingChat ? <Outlet /> : <ChatListPage />}</div>;
}

export default Home;

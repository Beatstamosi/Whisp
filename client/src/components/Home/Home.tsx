import style from "./Home.module.css";
import { Outlet, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import ChatListPage from "../ChatListPage/ChatListPage";

function Home() {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const location = useLocation();
  const isStartPage = location.pathname === "/";

  if (isDesktop) {
    return (
      <div className={style.homeLayoutWrapper}>
        <div className={style.chatList}>
          <ChatListPage />
        </div>
        <div className={style.chatPage}>
          {isStartPage ? (
            <div className={style.startPageInfo}>
              Select a chat or recipient to start Messaging with Whisp
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    );
  }

  // Mobile layout
  return (
    <div className={style.mobileLayout}>
      <Outlet />
    </div>
  );
}

export default Home;

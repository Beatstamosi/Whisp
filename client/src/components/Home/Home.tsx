import style from "./Home.module.css";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import ChatListPage from "../ChatListPage/ChatListPage";
import ChatPage from "../ChatPage/ChatPage";

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
          {viewingChat ? (
            <ChatPage />
          ) : (
            <div className={style.noChatSelected}>
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mobile layout
  return (
    <div className={style.mobileLayout}>
      {viewingChat ? <ChatPage /> : <ChatListPage />}
    </div>
  );
}

export default Home;

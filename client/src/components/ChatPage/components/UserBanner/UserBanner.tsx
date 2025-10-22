import style from "./UserBanner.module.css";
import whispLogo from "../../../../assets/whisp_logo.png";
import fallBackProfileImg from "../../../../assets/fallback_profile_img.png";
import { useNavigate } from "react-router-dom";
import type { Chat } from "../../../types/Chats";
import type { ChatParticipants } from "../../../types/ChatParticipants";

interface UserBannerType {
  chat: Chat | null;
  recipient: ChatParticipants | undefined;
}

function UserBanner({ chat, recipient }: UserBannerType) {
  const navigate = useNavigate();

  const openProfile = (e: React.MouseEvent, userId: string | undefined) => {
    e.preventDefault();
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const openGroupChatInfo = (
    e: React.MouseEvent,
    chatId: string | undefined
  ) => {
    e.preventDefault();
    if (chatId) {
      navigate(`/profile/group/${chatId}`);
    }
  };

  return (
    <>
      {!chat?.is_group ? (
        <div
          className={style.userBanner}
          onClick={(e) => openProfile(e, recipient?.user?.id)}
        >
          <img
            src={recipient?.user?.profile_picture || fallBackProfileImg}
            alt={`${recipient?.user?.firstname} ${recipient?.user?.lastname}`}
            className={style.avatar}
          />
          <div className={style.userInfo}>
            <span className={style.userName}>
              {recipient?.user?.firstname} {recipient?.user?.lastname}
            </span>
            <span className={style.lastOnline}>
              Last online:{" "}
              {recipient?.user?.last_seen_at &&
                new Intl.DateTimeFormat("default", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(recipient.user.last_seen_at))}
            </span>
          </div>
        </div>
      ) : (
        // Group Chat Banner
        <div
          className={style.userBanner}
          onClick={(e) => openGroupChatInfo(e, chat.id)}
        >
          <img src={whispLogo} className={style.avatar} />
          <div className={style.userInfo}>
            <span className={style.userName}>{chat?.name}</span>
            <span className={style.lastOnline}>
              {chat?.participants?.map((p) => p.user.firstname).join(", ")}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default UserBanner;

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import style from "./Message.module.css";
import type { Chat } from "../types/Chats";
import type { Messages } from "../types/Messages";

interface MessageType {
  chat: Chat;
  isSender: boolean;
  message: Messages;
  userId: string | undefined;
}

function Message({ chat, isSender, message, userId }: MessageType) {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const hasRead = message.messageRead.some((read) => read.userId === userId);

  useEffect(() => {
    const markAsRead = async (messageId: string) => {
      try {
        await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/messages/read/${messageId}/${userId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );
      } catch (err) {
        console.error("Error marking message as read: ", err);
      }
    };
    if (inView && message.senderId !== userId && !hasRead) {
      markAsRead(message.id);
    }
  }, [
    inView,
    message.id,
    message.messageRead,
    userId,
    hasRead,
    message.senderId,
  ]);

  return (
    <div
      ref={ref}
      className={`${style.message} ${
        isSender ? style.sender : style.recipient
      }`}
    >
      {chat.is_group && !isSender && (
        <div
          className={style.senderGroupChat}
        >{`${message.sender?.firstname} ${message.sender?.lastname}`}</div>
      )}
      <div className={style.messageContent}>{message.content}</div>
      <span className={style.messageSentAt}>
        {message.sent_at &&
          new Intl.DateTimeFormat("default", {
            timeStyle: "short",
          }).format(new Date(message.sent_at))}
      </span>
    </div>
  );
}

export default Message;

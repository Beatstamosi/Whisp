import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import style from "./Message.module.css";
import type { Chat } from "../types/Chats";
import type { Messages } from "../types/Messages";
import type { MessageAttachments } from "../types/MessageAttachments";

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

  const handleDownload = (file: MessageAttachments) => {
    const byteCharacters = atob(file.file_data!);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file.file_type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.file_name || "download";
    link.click();
  };

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
      {message.messageAttachments?.map((a) => (
        <div key={a.id}>
          <span>{a.file_name}</span>
          <button
            onClick={() => handleDownload(a)}
            className={style.downloadButton}
          >
            Download
          </button>
        </div>
      ))}
    </div>
  );
}

export default Message;

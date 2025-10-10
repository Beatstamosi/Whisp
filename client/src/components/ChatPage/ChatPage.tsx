import { useParams } from "react-router-dom";
import type { Chat } from "../types/Chats";
import { useState, useEffect } from "react";
import style from "./ChatPage.module.css";
import { useAuth } from "../Authentication/useAuth";
import fallBackProfileImg from "../../assets/fallback_profile_img.png";

function ChatPage() {
  const { user } = useAuth();
  const { chatId } = useParams();
  const [chat, setChat] = useState<Chat | null>(null);
  let recipient;

  if (!chat?.is_group) {
    recipient = chat?.participants?.find((p) => p.user?.id != user?.id);
  }

  // TODO: IMPLEMENT GROUP CHAT MECHANIC

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/chats/${chatId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          setChat(data.chat);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchChats();
  }, [chatId]);

  console.log(chat);

  // Top bar with chat name / recipient name
  // last online: last_seen_at;
  // on click open profile of user
  // on click open group chat overview

  // messages
  // if message.senderId === req.user.id mark as sender, else as receiver
  // if no messages: Start conversation

  // send message field
  // textarea, emojis ?
  // send message btn

  return (
    <div>
      {/* User Banner */}
      <div className={style.userBanner}>
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

      {/* Message Area */}
      <div className={style.messageContainer}>
        {chat?.messages?.length === 0 ? (
          <div className={style.noMessages}>Start a conversation!</div>
        ) : (
          chat?.messages?.map((message) => {
            const isSender = message.sender?.id === user?.id;
            return (
              <div
                key={message.id}
                className={`${style.messageWrapper} ${
                  isSender ? style.senderWrapper : style.recipientWrapper
                }`}
              >
                {!isSender && message.sender && (
                  <img
                    src={message.sender.profile_picture || fallBackProfileImg}
                    alt={`${message.sender.firstname} ${message.sender.lastname}`}
                    className={style.messageAvatar}
                  />
                )}
                <div
                  className={`${style.message} ${
                    isSender ? style.sender : style.recipient
                  }`}
                >
                  <div className={style.messageContent}>{message.content}</div>
                  <span className={style.messageSentAt}>
                    {message.sent_at &&
                      new Intl.DateTimeFormat("default", {
                        timeStyle: "short",
                      }).format(new Date(message.sent_at))}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ChatPage;

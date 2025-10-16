import { useParams, useNavigate } from "react-router-dom";
import type { Chat } from "../types/Chats";
import { useState, useEffect, useRef, useCallback } from "react";
import style from "./ChatPage.module.css";
import { useAuth } from "../Authentication/useAuth";
import fallBackProfileImg from "../../assets/fallback_profile_img.png";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import type { ChatParticipants } from "../types/ChatParticipants";
import whispLogo from "../../assets/groupChatFallBack.png";

function ChatPage() {
  const { user } = useAuth();
  const { chatId } = useParams();
  const [chat, setChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  let recipient: ChatParticipants | undefined;

  if (!chat?.is_group && chat?.participants) {
    if (chat.participants.length === 1) {
      // self-chat — only one participant
      recipient = chat.participants[0];
    } else {
      // regular chat — find the *other* user
      recipient = chat.participants.find((p) => p.user?.id !== user?.id);
    }
  }

  // Handle clicking outside of emoji picker to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        emojiButtonRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onEmojiClick = useCallback((emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  }, []);

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

  const openProfile = (e: React.MouseEvent, userId: string | undefined) => {
    e.preventDefault();
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const handlerSendMessage = async (
    e: React.MouseEvent | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chats/${chatId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({ content: message }),
        }
      );

      // PLACEHOLDER UNTIL WEBSOCKET IS IMPLEMENTED
      if (res.ok) {
        setMessage("");
        navigate(0);
      }
    } catch (err) {
      console.error("Error sending message: ", err);
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
    <div>
      {/* User Banner */}
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
              </div>
            );
          })
        )}
      </div>

      {/* Message Input Area */}
      <div className={style.inputContainer}>
        <div className={style.emojiPickerWrapper}>
          <button
            ref={emojiButtonRef}
            className={style.emojiButton}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            aria-label="Open emoji picker"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5 11C16.3284 11 17 10.3284 17 9.5C17 8.67157 16.3284 8 15.5 8C14.6716 8 14 8.67157 14 9.5C14 10.3284 14.6716 11 15.5 11Z"
                fill="currentColor"
              />
              <path
                d="M8.5 11C9.32843 11 10 10.3284 10 9.5C10 8.67157 9.32843 8 8.5 8C7.67157 8 7 8.67157 7 9.5C7 10.3284 7.67157 11 8.5 11Z"
                fill="currentColor"
              />
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 17.5C14.33 17.5 16.32 16.04 17.12 14H6.88C7.68 16.04 9.67 17.5 12 17.5Z"
                fill="currentColor"
              />
            </svg>
          </button>
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className={style.emojiPickerContainer}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
        <textarea
          className={style.messageInput}
          placeholder="Type a message..."
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handlerSendMessage(e);
            }
          }}
        />
        <button
          className={style.sendButton}
          aria-label="Send message"
          onClick={(e) => handlerSendMessage(e)}
          disabled={message.length < 1}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatPage;

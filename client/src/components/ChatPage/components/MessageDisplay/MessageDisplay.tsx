import style from "./MessageDisplay.module.css";
import Message from "../../../Message/Message";
import type { Chat } from "../../../types/Chats";
import { useAuth } from "../../../Authentication/useAuth";
import fallBackProfileImg from "../../../../assets/fallback_profile_img.png";
import { useRef, useCallback, useEffect } from "react";

interface MessageDisplayTypes {
  chat: Chat | null;
}

function MessageDisplay({ chat }: MessageDisplayTypes) {
  const { user } = useAuth();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages, scrollToBottom]);

  return (
    <div className={style.messageContainer} ref={messageContainerRef}>
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
              <Message
                chat={chat}
                isSender={isSender}
                message={message}
                userId={user?.id}
              />
            </div>
          );
        })
      )}
    </div>
  );
}

export default MessageDisplay;

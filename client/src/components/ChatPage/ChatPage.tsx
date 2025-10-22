import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../Authentication/useAuth";
import useSocket from "../../hooks/useSocket";
import UserBanner from "./components/UserBanner/UserBanner";
import MessageDisplay from "./components/MessageDisplay/MessageDisplay";
import MessageInput from "./components/MessageInput/MessageInput";
import type { Chat } from "../types/Chats";
import type { ChatParticipants } from "../types/ChatParticipants";

function ChatPage() {
  const { user } = useAuth();
  const { chatId } = useParams();
  const [chat, setChat] = useState<Chat | null>(null);
  const socket = useSocket().current;
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

  useEffect(() => {
    if (!chatId || !socket) return;
    socket.emit("join", chatId);

    socket.on("chat:message", (updatedChat: Chat) => {
      setChat(updatedChat);
    });
    return () => {
      socket.off("chat:message");
      socket.emit("leave", chatId);
    };
  }, [chatId, socket]);


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

  

  return (
    <div>
      {/* User Banner */}
      <UserBanner chat={chat} recipient={recipient} />

      {/* Message Area */}
      <MessageDisplay chat={chat} />

      {/* Message Input Area */}
      <MessageInput chatId={chatId}/>
    </div>
  );
}

export default ChatPage;

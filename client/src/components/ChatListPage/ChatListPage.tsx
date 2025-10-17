import style from "./ChatListPage.module.css";
import type { Chat } from "../types/Chats";
import { useEffect, useState } from "react";
import type { User } from "../types/User";
import fallBackProfileImg from "../../assets/fallback_profile_img.png";
import whispLogo from "../../assets/groupChatFallBack.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/useAuth";

// TODO: implement socket.io to have open websocket connection on mount for chats; turn off on demount

function ChatListPage() {
  interface ChatWithUnread extends Chat {
    _count: {
      messages: number;
    };
  }

  const [chats, setChats] = useState<ChatWithUnread[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [displayChats, setDisplayChats] = useState<ChatWithUnread[] | null>();
  const [displayUsers, setDisplayUsers] = useState<User[] | null>();
  const [activeView, setActiveView] = useState<"chats" | "user">("chats");
  const { user } = useAuth();
  const navigate = useNavigate();

  // get all chats of user via useEffect; store in state
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setChats(data.chats);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchChats();
  }, []);

  // Initiate displayChats with all chats from DB
  useEffect(() => {
    setDisplayChats(chats);
  }, [chats]);

  // get all users of plattform via useEffect; store in state
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // Initiate displayUsers with all Users from DB
  useEffect(() => {
    setDisplayUsers(users);
  }, [users]);

  // search bar
  const searchHandler = (value: string) => {
    value = value.toLowerCase();

    if (activeView === "chats") {
      const filteredChats = chats?.filter((chat) =>
        chat.name.toLowerCase().includes(value)
      );

      if (filteredChats) {
        setDisplayChats(filteredChats);
      } else {
        setDisplayChats(chats);
      }
    } else if (activeView === "user") {
      const filteredUsers = users?.filter(
        (user) =>
          user.firstname.toLowerCase().includes(value) ||
          user.lastname.toLowerCase().includes(value)
      );

      if (filteredUsers) {
        setDisplayUsers(filteredUsers);
      } else {
        setDisplayUsers(users);
      }
    }
  };

  const handleOpenChatWithUserClick = async (recipientId: string) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/chats/open-chat-user/${recipientId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();

      navigate(`/chat/${data.chatId}`);
    } catch (err) {
      console.error("Error opening chat with user ", err);
      navigate("/error");
    }
  };

  const getChatDisplayName = (chat: Chat) => {
    // Group Chat
    if (chat.is_group) {
      return chat.name;
      // Chat with oneself
    } else if (chat.participants?.length === 1) {
      return `${chat?.participants?.[0].user?.firstname} ${chat?.participants?.[0].user?.lastname}`;
      // Personal Chat
    } else {
      const recipient = chat.participants?.find((p) => p.user.id !== user?.id);
      if (recipient?.user) {
        return `${recipient?.user.firstname} ${recipient.user.lastname}`;
      }
    }
  };

  const getChatAvatar = (chat: Chat) => {
    let imageSrc;

    // Group Chat
    if (chat.is_group) {
      imageSrc = whispLogo;
      // Chat with oneself
    } else if (chat.participants?.length === 1) {
      imageSrc =
        chat?.participants?.[0].user?.profile_picture ?? fallBackProfileImg;
      // Personal Chat
    } else {
      const recipient = chat.participants?.find((p) => p.user.id !== user?.id);
      if (recipient?.user) {
        imageSrc = recipient.user.profile_picture ?? fallBackProfileImg;
      }
    }

    return <img src={imageSrc} className={style.avatar} />;
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";

    return `${new Date(date).toLocaleDateString()} ${new Intl.DateTimeFormat(
      "default",
      { timeStyle: "short" }
    ).format(new Date(date))}`;
  };

  const handlerCreateGroupChat = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    navigate(`/create-group-chat/${user?.id}`);
  };

  return (
    <div className={style.chatListWrapper}>
      <div className={style.filterMenuWrapper}>
        <button
          onClick={() => setActiveView("chats")}
          className={activeView === "chats" ? style.active : ""}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveView("user")}
          className={activeView === "user" ? style.active : ""}
        >
          Users
        </button>
      </div>

      <input
        type="search"
        placeholder="Search by Name"
        onChange={(e) => searchHandler(e.target.value)}
      />

      <div className={activeView === "chats" ? style.chatList : style.userList}>
        {activeView === "chats" &&
          displayChats?.map((chat) => {
            const lastMessage = chat.messages?.[0];

            return (
              <div
                key={chat.id}
                className={style.chatItem}
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                {getChatAvatar(chat)}
                <div className={style.itemInfo}>
                  <h2>{getChatDisplayName(chat)}</h2>
                  <p className={style.messageContent}>
                    {lastMessage?.content && lastMessage.content.length > 35
                      ? `${lastMessage.content.slice(0, 35)}...`
                      : lastMessage?.content}
                  </p>
                  <p className={style.timestamp}>
                    {lastMessage?.sent_at && formatDate(lastMessage.sent_at)}
                  </p>
                  {chat._count.messages > 0 && (
                    <span className={style.unreadCount}>
                      {chat._count.messages}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

        {activeView === "user" &&
          displayUsers?.map((user) => (
            <div
              key={user.id}
              className={style.userItem}
              onClick={() => handleOpenChatWithUserClick(user.id)}
            >
              <img
                src={user.profile_picture || fallBackProfileImg}
                alt={`${user.firstname} ${user.lastname}`}
                className={style.avatar}
              />
              <div className={style.itemInfo}>
                <h2>
                  {user.firstname} {user.lastname}
                </h2>
                {user.bio && <p className={style.messageContent}>{user.bio}</p>}
              </div>
            </div>
          ))}
      </div>
      <div className={style.createGroupChatBtn}>
        <button onClick={(e) => handlerCreateGroupChat(e)}>+</button>
      </div>
    </div>
  );
}

export default ChatListPage;

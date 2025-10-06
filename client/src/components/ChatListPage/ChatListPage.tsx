import style from "./ChatListPage.module.css";
import type { Chat } from "../types/Chats";
import { useEffect, useState } from "react";
import type { User } from "../types/User";

function ChatListPage() {
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [displayChats, setDisplayChats] = useState<Chat[] | null>();
  const [displayUsers, setDisplayUsers] = useState<User[] | null>();
  const [activeView, setActiveView] = useState<"chats" | "user">("chats");

  // get all chats of user via useEffect; store in state
  // TODO: IMPLEMENT BACKEND
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
  // TODO: IMPLEMENT BACKEND
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

  // TODO: implement socket.io to have open websocket connection on mount for chats; turn off on demount

  // search bar
  const searchHandler = (value: string) => {
    if (activeView === "chats") {
      const filteredChats = chats?.filter((chat) => chat.name.includes(value));

      if (filteredChats) {
        setDisplayChats(filteredChats);
      } else {
        setDisplayChats(chats);
      }
    } else if (activeView === "user") {
      const filteredUsers = users?.filter(
        (user) =>
          user.firstname.includes(value) || user.lastname.includes(value)
      );

      if (filteredUsers) {
        setDisplayUsers(filteredUsers);
      } else {
        setDisplayUsers(users);
      }
    }
  };

  return (
    <div>
      <div className={style.filterMenuWrapper}>
        <button onClick={() => setActiveView("chats")}>Chats</button>
        <button onClick={() => setActiveView("user")}>Users</button>
      </div>
      <div>
        <input
          type="search"
          placeholder="Search by Name"
          onChange={(e) => searchHandler(e.target.value)}
        />
      </div>
      {activeView === "chats" &&
        displayChats?.map((chat) => (
          <div key={chat.id}>
            <h2>{chat.name}</h2>
          </div>
        ))}

      {activeView === "user" &&
        displayUsers?.map((user) => (
          <div key={user.id}>
            <h2>{user.firstname}</h2>
          </div>
        ))}
    </div>
  );
}

export default ChatListPage;

import { useEffect, useState } from "react";
import style from "./CreateGroupChat.module.css";
import { useParams } from "react-router-dom";
import type { User } from "../types/User";
import fallBackProfileImg from "../../assets/fallback_profile_img.png";

// TODO: Handle create chat
// TODO: Add users to participants

function CreateGroupChat() {
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>();
  const [displayUsers, setDisplayUsers] = useState<User[] | null>();
  const { userId } = useParams();

  // add creator directly to chat
  useEffect(() => {
    if (userId) {
      setParticipants((prev) => [...prev, userId]);
    }
  }, [userId]);

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
    const usersWithOuthOP = users?.filter((user) => user.id !== userId);
    setDisplayUsers(usersWithOuthOP);
  }, [users, userId]);

  const searchHandler = (value: string) => {
    value = value.toLowerCase();

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
  };

  return (
    <div className={style.pageWrapper}>
      <div className={style.setNameWrapper}>
        <label htmlFor="name">Enter Name:</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Group Chat"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={style.mainContent}>
        <input
          type="search"
          placeholder="Search by Name"
          onChange={(e) => searchHandler(e.target.value)}
          className={style.searchInput}
        />

        <div className={style.userListWrapper}>
          <form className={style.userList}>
            {displayUsers?.map((user) => (
              <label key={user.id} className={style.userItem}>
                <img
                  src={user.profile_picture || fallBackProfileImg}
                  alt={`${user.firstname} ${user.lastname}`}
                  className={style.avatar}
                />
                <div className={style.itemInfo}>
                  <h2>
                    {user.firstname} {user.lastname}
                  </h2>
                  {user.bio && (
                    <p className={style.messageContent}>{user.bio}</p>
                  )}
                </div>
                <input
                  type="checkbox"
                  value={user.id}
                  checked={participants.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setParticipants((prev) => [...prev, user.id]);
                    } else {
                      setParticipants((prev) =>
                        prev.filter((id) => id !== user.id)
                      );
                    }
                  }}
                  className={style.checkbox}
                />
              </label>
            ))}
          </form>
        </div>

        <div className={style.buttonWrapper}>
          <button
            disabled={participants.length < 3 || !name.trim()}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Create Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupChat;

import { useNavigate, useParams } from "react-router-dom";
import style from "./ViewProfile.module.css";
import fallBackProfileImg from "../../assets/fallback_profile_img.png";
import { useEffect, useState } from "react";
import type { User } from "../types/User";

function ViewProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div className={style.loading}>Loading...</div>;
  }

  if (error || !user) {
    return <div className={style.error}>{error || "User not found"}</div>;
  }

  const formattedDate = new Date(user.signed_up_at).toLocaleDateString(
    "default",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const handleStartChat = async (
    e: React.MouseEvent,
    userId: string | undefined
  ) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chats/open-chat-user/${userId}`,
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

  return (
    <div className={style.container}>
      <div className={style.profileCard}>
        <button
          onClick={() => navigate(-1)}
          className={style.backButton}
          aria-label="Return to chat"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <div className={style.imageContainer}>
          <img
            src={user.profile_picture || fallBackProfileImg}
            alt={`${user.firstname} ${user.lastname}'s profile`}
            className={style.profileImage}
          />
        </div>

        <div className={style.userInfo}>
          <h1 className={style.userName}>
            {user.firstname} {user.lastname}
          </h1>
          <div>
            <button
              className={style.startChatBtn}
              onClick={(e) => handleStartChat(e, userId)}
            >
              Start Chat
            </button>
          </div>

          <div className={style.infoSection}>
            <h2 className={style.sectionTitle}>Bio</h2>
            <p className={style.bio}>{user.bio || "No bio available"}</p>
          </div>

          <div className={style.infoSection}>
            <h2 className={style.sectionTitle}>Member Since</h2>
            <p className={style.joinDate}>{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;

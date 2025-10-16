import { useNavigate, useParams } from "react-router-dom";
import style from "./GroupChatProfile.module.css";
import { useState, useEffect } from "react";
import type { ChatParticipants } from "../types/ChatParticipants";
import fallBackProfileImg from "../../assets/fallback_profile_img.png";

function GroupChatProfile() {
  const [participants, setParticipants] = useState<ChatParticipants[] | null>(
    null
  );
  const { chatId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/chats/${chatId}/participants`,
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
          setParticipants(data.participants);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchParticipants();
  }, [chatId]);

  const openProfile = (participantId: string | undefined) => {
    if (participantId) {
      navigate(`/profile/${participantId}`);
    }
  };

  return (
    <div>
      <div className={style.banner}>
        <button onClick={() => navigate(-1)} className={style.backButton}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
              fill="#7c4dff"
            />
          </svg>
        </button>
        <span>Chat Participants</span>
      </div>
      <div className={style.userList}>
        {participants?.map((participant) => (
          <div
            key={participant.id}
            className={style.participantItem}
            onClick={() => openProfile(participant.user.id)}
          >
            <img
              src={participant.user.profile_picture || fallBackProfileImg}
              alt={`${participant.user.firstname} ${participant.user.lastname}`}
              className={style.avatar}
            />
            <div className={style.itemInfo}>
              <h2>
                {participant.user.firstname} {participant.user.lastname}
              </h2>
              {participant.user.bio && (
                <p className={style.messageContent}>{participant.user.bio}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupChatProfile;

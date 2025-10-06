import type { Chat } from "./Chats";
import type { User } from "./User";

export type ChatParticipants = {
  id: string;
  chat?: Chat;
  chatId: string;
  user?: User;
  userId: string;
  joined_at: string;
};

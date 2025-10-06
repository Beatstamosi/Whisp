import type { Chat } from "./Chats";
import type { MessageAttachments } from "./MessageAttachments";
import type { MessageRead } from "./MessageRead";
import type { User } from "./User";

export type Messages = {
  id: string;
  chat?: Chat;
  chatId: string;
  sender?: User;
  senderId: string;
  content: string;
  sent_at: string;
  messageRead: MessageRead[];
  messageAttachments?: MessageAttachments[];
};

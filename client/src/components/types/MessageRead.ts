import type { Messages } from "./Messages";
import type { User } from "./User";

export type MessageRead = {
  id: string;
  message?: Messages;
  messageId: string;
  user?: User;
  userId: string;
};

import type { ChatParticipants } from "./ChatParticipants";
import type { Messages } from "./Messages";

export type Chat = {
  id: string;
  created_at: string;
  is_group: boolean;
  name: string;
  participants?: ChatParticipants[];
  messages?: Messages[];
};

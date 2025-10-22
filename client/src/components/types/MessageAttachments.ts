import type { Messages } from "./Messages";

export type MessageAttachments = {
  id: string;
  message?: Messages;
  messageId: string;
  file_name?: string;
  file_type?: string;
  file_data?: string;
  uploaded_at: string;
};

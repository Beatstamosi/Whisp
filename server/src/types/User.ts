export type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  bio?: string | null;
  profile_picture: Buffer | Uint8Array | null;
  signed_up_at: Date;
  last_seen_at?: Date | null;
};

export type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  bio: string;
  profile_picture?: string | null;
  signed_up_at: string;
  last_seen_at?: string | null;
};

export type UserRole =
  | "customer"
  | "admin";

export interface Profile {
  id: string;
  name: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
}
import { UserRole, AccountStatus } from "./common";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

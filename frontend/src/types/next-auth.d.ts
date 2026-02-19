import { DefaultSession, DefaultUser } from "next-auth";
import { UserRole, AccountStatus } from "@/types/common";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      status: AccountStatus;
      firstName: string;
      lastName: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: UserRole;
    status: AccountStatus;
    firstName: string;
    lastName: string;
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    status: AccountStatus;
    firstName: string;
    lastName: string;
  }
}

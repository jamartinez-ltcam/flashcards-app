import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    role: "PARENT" | "CHILD";
  }

  interface Session {
    user: {
      id: string;
      username: string;
      role: "PARENT" | "CHILD";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: "PARENT" | "CHILD";
  }
}

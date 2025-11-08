import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "SUPER_ADMIN" | "ADMIN" | "SITE_MANAGER"
      siteIds: string[]
    } & DefaultSession["user"]
  }

  interface User {
    role: "SUPER_ADMIN" | "ADMIN" | "SITE_MANAGER"
    siteIds: string
  }
}

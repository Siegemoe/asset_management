# NextAuth Production Configuration Fix

## Issue
In production mode, NextAuth requires explicit host configuration. The current auth configuration will fail with "UntrustedHost" errors.

## Solution

Update your auth configuration file (`src/auth.ts`) to include trusted hosts:

```typescript
import NextAuth, { type Session, type User } from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // Add trusted hosts for production
  trustHost: true, // Allow all hosts in production
  // Or specify specific hosts:
  // debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      if (user) {
        session.user.id = user.id as string
        session.user.role = user.role || "SITE_MANAGER"
        session.user.siteIds = user.siteIds ? JSON.parse(user.siteIds) : []
      }
      return session
    },
  },
})
```

## Environment Variables

Make sure your `.env` file includes:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL="file:./dev.db"
```

## Development vs Production

- **Development**: Use `trustHost: true` for flexibility
- **Production**: Specify exact trusted hosts:
```typescript
auth: {
  baseURL: process.env.AUTH_TRUST_ORIGIN || process.env.NEXTAUTH_URL,
  origin: process.env.AUTH_TRUST_ORIGIN || process.env.NEXTAUTH_URL,
}
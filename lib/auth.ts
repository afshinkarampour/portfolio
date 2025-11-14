import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

// NextAuth Settings
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPassHash) {
          throw new Error(
            "Admin credentials are not set in environment variables."
          );
        }

        if (credentials.email !== adminEmail) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          adminPassHash
        );
        if (!isValid) return null;

        // return object user
        return { id: "admin", name: "Admin", email: adminEmail, role: "admin" };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin-login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role;
      return session;
    },
  },
};

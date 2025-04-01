import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      // Google requires "offline" access_type to provide a `refresh_token`
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const lookupResponse = await fetch(
          `${process.env.API_DOMAIN}/users/lookup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          },
        );
        const lookupData = await lookupResponse.json();

        if (!lookupData || !lookupData.data) {
          const registerResponse = await fetch(
            `${process.env.API_DOMAIN}/auth/register`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                profileImage: user.image,
                provider: "GOOGLE",
                isVerified: true,
              }),
            },
          );

          if (!registerResponse.ok) {
            console.error("Failed to register user");
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in process:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        const response = await fetch(`${process.env.API_DOMAIN}/users/lookup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });
        const userData = await response.json();
        token.role = userData.data.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }

      return session;
    },
  },
  jwt: {
    encode: ({ token }) => {
      if (!token) {
        throw new Error("Missing JWT token");
      }

      return jwt.sign(token as object, process.env.JWT_SECRET as string);
    },
    decode: ({ token }) => {
      if (!token) {
        throw new Error("Missing JWT token");
      }

      return jwt.verify(
        token as string,
        process.env.JWT_SECRET as string,
      ) as JWT;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: "accessToken",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain:
          process.env.NODE_ENV === "production"
            ? "online-grocery.com"
            : "localhost",
      },
    },
  },
});

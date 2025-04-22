import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { fetchJsonApi } from "./utils/fetch-json-api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      try {
        try {
          const data = await fetchJsonApi({
            url: `${process.env.API_DOMAIN}/users/lookup?email=${user.email}`,
            errorMessage: "Failed to lookup user",
          });

          if (data.data.provider !== "GOOGLE") {
            const message =
              "Your email registered using credentials. Please continue using credentials instead";
            return `/error?error=AccessDenied&message=${encodeURIComponent(message)}`;
          }

          return true;
        } catch (error) {
          console.error(error);
          await fetchJsonApi({
            url: `${process.env.API_DOMAIN}/auth/register`,
            method: "POST",
            body: {
              email: user.email,
              name: user.name,
              profileImage: user.image,
              provider: "GOOGLE",
              isVerified: true,
            },
            errorMessage: "Failed to register",
          });

          return true;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user && account) {
        try {
          const lookupData = await fetchJsonApi({
            url: `${process.env.API_DOMAIN}/users/lookup?email=${user.email}`,
            errorMessage: "Failed to lookup user",
          });

          token.role = lookupData.data.role;
        } catch (error) {
          console.error(error);
        }
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
        sameSite: "none",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain:
          process.env.NODE_ENV === "production"
            ? "online-grocery-web.vercel.app"
            : "localhost",
      },
    },
  },
  pages: {
    error: "/error",
  },
});

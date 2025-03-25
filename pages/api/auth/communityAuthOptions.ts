import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import {
  nextAuthOptions,
  unitConversion
} from "~community/common/constants/configs";
import ROUTES from "~community/common/constants/routes";
import { decodeJWTToken } from "~community/common/utils/authUtils";
import authFetch from "~community/common/utils/axiosInterceptor";

export const communityAuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        firstName: { label: "First Name", type: "text", optional: true },
        lastName: { label: "Last Name", type: "text", optional: true }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        let url;
        let body;

        if (credentials.firstName && credentials.lastName) {
          url = "/auth/signup/super-admin";
          body = {
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            email: credentials.email,
            password: credentials.password,
            confirmPassword: credentials.password
          };
        } else {
          url = "/auth/sign-in";
          body = {
            email: credentials.email,
            password: credentials.password
          };
        }

        try {
          const response = await authFetch.post(url, body);

          const user = response?.data?.results[0];

          if (user) {
            const newUser = {
              ...user,
              email: credentials.email
            };
            return newUser;
          }
          return null;
        } catch (error) {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: nextAuthOptions.SESSION_STRATEGY,
    maxAge: nextAuthOptions.SESSION_MAX_AGE as number
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const decodedTokenJSON = decodeJWTToken(user.accessToken as string);
        token.roles = decodedTokenJSON?.roles || [];
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.tokenDuration = decodedTokenJSON?.exp;
        token.isPasswordChangedForTheFirstTime =
          user.isPasswordChangedForTheFirstTime;
        token.employee = user.employee;
        token.email = user.email;
        token.userId = user.userId;
      }

      if (
        Date.now() <
        (token?.tokenDuration as number) *
          unitConversion.MILLISECONDS_PER_SECOND
      ) {
        return token;
      }

      const res = await authFetch.post("/auth/refresh-token", {
        refreshToken: token?.refreshToken
      });

      token.accessToken = res?.data?.results[0]?.accessToken;
      const decodedTokenJSON = decodeJWTToken(token.accessToken as string);
      token.tokenDuration = decodedTokenJSON?.exp;

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.roles = token.roles || [];
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.isPasswordChangedForTheFirstTime =
          token.isPasswordChangedForTheFirstTime;
        session.user.email = token.email;
        session.user.employee = token.employee;
        session.user.userId = token.userId;
      }
      return session;
    }
  },
  pages: {
    signIn: ROUTES.AUTH.SIGNIN,
    error: ROUTES.AUTH.ERROR
  }
};

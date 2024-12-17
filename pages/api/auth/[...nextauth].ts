import NextAuth from "next-auth";

import { enterpriseAuthOptions } from "~enterprise/auth/enterpriseAuthOptions";

import { communityAuthOptions } from "./communityAuthOptions";

const authOptions =
  process.env.NEXT_PUBLIC_MODE === "enterprise"
    ? enterpriseAuthOptions
    : communityAuthOptions;

export default NextAuth(authOptions);

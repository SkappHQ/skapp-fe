import NextAuth from "next-auth";

import { communityAuthOptions } from "../../community/auth/communityAuthOptions";
import { enterpriseAuthOptions } from "../../enterprise/auth/enterpriseAuthOptions";

const authOptions =
  process.env.NEXT_PUBLIC_MODE === "enterprise"
    ? enterpriseAuthOptions
    : communityAuthOptions;

export default NextAuth(authOptions);

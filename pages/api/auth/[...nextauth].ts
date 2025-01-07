import NextAuth from "next-auth";

import { authOptions } from "~community/auth/authOptions";

export default NextAuth(authOptions);

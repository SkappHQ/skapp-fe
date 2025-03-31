import { signOut } from "next-auth/react";
import { useEffect } from "react";

import { useRedirectHandler } from "~community/common/utils/hooks/useRedirectHandler";

export default function Index() {
  useEffect(() => {
    if (!window.location.host.includes("app")) {
      const tenant = window.location.host.split(".")[0];
      if (tenant !== "app") {
        signOut({
          redirect: false
        });
      }
    }
  }, []);

  useRedirectHandler({ isSignInPage: false });

  return null;
}

import { signOut } from "next-auth/react";
import { useEffect } from "react";

import { appModes } from "~community/common/constants/configs";
import { APP, LOCALHOST } from "~community/common/constants/stringConstants";
import { useRedirectHandler } from "~community/common/utils/hooks/useRedirectHandler";

export default function Index() {
  const tenant = window.location.host.split(".")[0];

  const isEnterprise = process.env.NEXT_PUBLIC_MODE === appModes.ENTERPRISE;

  useEffect(() => {
    if (
      (tenant === APP || tenant.split(":")[0] === LOCALHOST) &&
      isEnterprise
    ) {
      signOut({
        redirect: false
      });
    }
  }, []);

  useRedirectHandler({ isSignInPage: false });

  return null;
}

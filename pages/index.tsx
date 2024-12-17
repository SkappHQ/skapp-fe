import { useRedirectHandler } from "~community/common/utils/hooks/useRedirectHandler";

export default function Index() {
  useRedirectHandler({ isSignInPage: false });

  return null;
}

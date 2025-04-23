import { useEffect } from "react";

/**
 * @description This hook is used to block navigation away from the current page.
 * It uses the `popstate` event to intercept back/forward navigation and prompts the user with a confirmation dialog.
 * If the user confirms, navigation proceeds; otherwise, it's blocked by pushing a new state to the history.
 */
const useBlockNavigation = (shouldBlock: boolean) => {
  useEffect(() => {
    if (!shouldBlock) return;

    const handlePopState = (_event: PopStateEvent) => {
      const confirmLeave = confirm("Are you sure you want to go back?");
      if (!confirmLeave) {
        history.pushState(null, "", window.location.href);
      }
    };

    history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [shouldBlock]);
};

export default useBlockNavigation;

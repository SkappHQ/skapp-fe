import { useEffect } from "react";

const useBlockNavigation = (shouldBlock: boolean) => {
  useEffect(() => {
    if (!shouldBlock) return;

    const handlePopState = (event: PopStateEvent) => {
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

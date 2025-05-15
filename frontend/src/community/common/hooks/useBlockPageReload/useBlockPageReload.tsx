import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useBlockPageReload = () => {
  const router = useRouter();
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  useEffect(() => {
    if (!previousPath && typeof window !== "undefined") {
      setPreviousPath(document.referrer || "/");
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Required for Chrome
      return ""; // For other browsers
    };

    const handleRouteChange = () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };

    const handleUnload = () => {
      if (previousPath) {
        sessionStorage.setItem("redirectAfterReload", "true");
      }
    };

    // Only go back if we navigated here after a page reload
    if (typeof window !== "undefined") {
      const shouldRedirect = sessionStorage.getItem("redirectAfterReload");
      if (shouldRedirect) {
        sessionStorage.removeItem("redirectAfterReload");
        router.back();
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, previousPath]);
};

export default useBlockPageReload;

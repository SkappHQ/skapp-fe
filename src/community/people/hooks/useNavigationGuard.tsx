import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

interface UseNavigationGuardProps {
  hasChanged: boolean;
  isUnsavedChangesModalOpen: boolean;
  setIsUnsavedChangesModalOpen: (isOpen: boolean) => void;
}

const useNavigationGuard = ({
  hasChanged,
  isUnsavedChangesModalOpen,
  setIsUnsavedChangesModalOpen
}: UseNavigationGuardProps) => {
  const allowRouteChangeRef = useRef<boolean>(false);
  const targetRouteRef = useRef<string>("");

  const router = useRouter();

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasChanged) {
      e.preventDefault();
      return "";
    }
  };

  const handleRouteChange = (url: string) => {
    if (allowRouteChangeRef.current) return;
    targetRouteRef.current = url;
    if (hasChanged && !isUnsavedChangesModalOpen) {
      setIsUnsavedChangesModalOpen(true);
      router.events.emit("routeChangeError");
      throw "routeChange aborted";
    }
  };

  const proceedWithRouteChange = async () => {
    if (!allowRouteChangeRef.current) {
      allowRouteChangeRef.current = true;
      const targetRoute = targetRouteRef.current;
      await router.push(targetRoute);
    }
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleRouteChange, handleBeforeUnload]);

  return {
    proceedWithRouteChange
  };
};

export default useNavigationGuard;

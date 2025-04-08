import { useRouter } from "next/router";
import { useEffect } from "react";

interface UseRouteChangeHandlerProps {
  preventNavigation?: (url: string) => boolean;
  onBeforeRouteAbort?: (url: string) => void;
  onRouteChange?: (url: string) => void;
}

export const useRouteChangeHandler = ({
  preventNavigation = () => false,
  onBeforeRouteAbort,
  onRouteChange
}: UseRouteChangeHandlerProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (preventNavigation?.(url)) {
        onBeforeRouteAbort?.(url);
        router.events.emit("routeChangeError");
        throw "routeChange aborted";
      } else {
        onRouteChange?.(url);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return "";
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [preventNavigation]);

  return {};
};

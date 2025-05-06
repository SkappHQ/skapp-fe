import { useRouter } from "next/router";
import { useEffect } from "react";

const useBlockPageReload = () => {
  const router = useRouter();

  useEffect(() => {
    // This function handles browser events when user tries to close/refresh the page
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault(); // Prevents the default browser behavior
    };

    // This function handles when user navigates to another page within the app
    const handleRouteChange = () => {
      // Removes the warning when navigating within the app
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };

    // Attaches the warning handler to the window's beforeunload event
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Listens for route changes within the Next.js app
    router.events.on("routeChangeStart", handleRouteChange);

    // Cleanup function that runs when component unmounts
    return () => {
      // Removes the beforeunload event listener
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Removes the Next.js route change listener
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);
};

export default useBlockPageReload;

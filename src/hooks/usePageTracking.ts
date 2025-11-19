import { logNavigation } from "@/utils/logger";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export function usePageTracking() {
  const router = useRouter();
  const previousUrl = useRef<string>("");

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (previousUrl.current && previousUrl.current !== url) {
        logNavigation(`Navigated from ${previousUrl.current} to ${url}`, url);
      }
      previousUrl.current = url;
    };

    handleRouteChange(router.asPath);

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);
}

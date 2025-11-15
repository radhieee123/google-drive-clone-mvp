import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { logScroll, logNavigation, logCustom } from "./index";

/**
 * Hook to track scroll events
 * Throttles scroll events to avoid excessive logging
 */
export function useScrollTracking(throttleMs: number = 1000) {
  const lastScrollTime = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();

      // Throttle scroll events
      if (now - lastScrollTime.current < throttleMs) {
        return;
      }

      lastScrollTime.current = now;

      logScroll("User scrolled page", window.scrollX, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [throttleMs]);
}

/**
 * Hook to track page navigation/route changes
 */
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

    // Log initial page load
    handleRouteChange(router.asPath);

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);
}

/**
 * Hook to track component mounting and unmounting
 */
export function useComponentTracking(componentName: string) {
  useEffect(() => {
    logCustom(`${componentName} mounted`, "COMPONENT_MOUNT", {
      component: componentName,
    });

    return () => {
      logCustom(`${componentName} unmounted`, "COMPONENT_UNMOUNT", {
        component: componentName,
      });
    };
  }, [componentName]);
}

/**
 * Hook to track API calls
 */
export function useApiTracking() {
  const trackApiCall = (
    endpoint: string,
    method: string,
    status: "success" | "error",
    errorMessage?: string,
  ) => {
    logCustom(`API call to ${endpoint}`, "API_CALL", {
      endpoint,
      method,
      status,
      error: errorMessage,
    });
  };

  return { trackApiCall };
}

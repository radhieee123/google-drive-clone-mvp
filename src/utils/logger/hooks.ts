import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { logScroll, logNavigation, logCustom } from "./index";

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

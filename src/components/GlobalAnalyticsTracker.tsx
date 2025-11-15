import { useEffect } from "react";
import { useScrollTracking, usePageTracking } from "../lib/logger/hooks";

export default function GlobalAnalyticsTracker() {
  usePageTracking();
  useScrollTracking(1000);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from the tab/window
      } else {
        // User returned to the tab/window
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}

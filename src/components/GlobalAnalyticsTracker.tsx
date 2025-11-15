import { useEffect } from "react";
import { useScrollTracking, usePageTracking } from "../lib/logger/hooks";

export default function GlobalAnalyticsTracker() {
  usePageTracking();
  useScrollTracking(1000);

  useEffect(() => {
    const handleVisibilityChange = () => {
      return null;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}

import { useEffect } from "react";
import { usePageTracking } from "../utils/logger/hooks";
import useScrollTracking from "../hooks/useScrollTracking";

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

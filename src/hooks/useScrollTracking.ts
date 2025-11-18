import { logScroll } from "@/utils/logger";
import { useEffect, useRef } from "react";

const useScrollTracking = (throttleMs: number = 1000) => {
  const lastScrollTime = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();

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
};

export default useScrollTracking;

import { logCustom } from "@/utils/logger";
import { useEffect } from "react";

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

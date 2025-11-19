import { logCustom } from "@/utils/logger";

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

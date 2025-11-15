import type { Log, LogEventInput, ActionType, LogPayload } from "./types";

const LOGGING_ENDPOINT = "/_synthetic/log_event";
const SESSION_ID_KEY = "synthetic_log_session_id";

let logIdCounter = 0;

function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    try {
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    } catch (error) {
      console.warn("Failed to store session ID:", error);
    }
  }

  return sessionId;
}

export async function logEvent(
  action_type: ActionType,
  payload: LogPayload,
): Promise<void> {
  try {
    const log: Log = {
      id: ++logIdCounter,
      timestamp: new Date().toISOString(),
      session_id: getSessionId(),
      action_type,
      payload,
    };

    await fetch(LOGGING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(log),
      keepalive: true,
    }).catch((error) => {
      console.warn("Synthetic logging failed:", error);
    });
  } catch (error) {
    console.warn("Error creating log event:", error);
  }
}

export function logClick(
  text: string,
  elementIdentifier: string,
  coordinates?: { x: number; y: number },
): void {
  logEvent("CLICK", {
    text,
    page_url: window.location.href,
    element_identifier: elementIdentifier,
    coordinates: coordinates || { x: 0, y: 0 },
  });
}

export function logKeyPress(
  text: string,
  elementIdentifier: string,
  key: string,
): void {
  logEvent("KEY_PRESS", {
    text,
    page_url: window.location.href,
    element_identifier: elementIdentifier,
    key,
  });
}

export function logScroll(
  text: string,
  scrollX: number,
  scrollY: number,
): void {
  logEvent("SCROLL", {
    text,
    page_url: window.location.href,
    scroll_x: scrollX,
    scroll_y: scrollY,
  });
}

export function logNavigation(text: string, targetUrl: string): void {
  logEvent("GO_TO_URL", {
    text,
    page_url: window.location.href,
    target_url: targetUrl,
  });
}

export function logStorage(
  text: string,
  storageType: "localStorage" | "sessionStorage",
  key: string,
  value: string,
): void {
  logEvent("SET_STORAGE", {
    text,
    page_url: window.location.href,
    storage_type: storageType,
    key,
    value,
  });
}

export function logCustom(
  text: string,
  customAction: string,
  data?: Record<string, any>,
): void {
  logEvent("CUSTOM", {
    text,
    custom_action: customAction,
    data,
  });
}

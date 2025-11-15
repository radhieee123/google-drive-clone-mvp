import type { Log, LogEventInput, ActionType, LogPayload } from "./types";

const LOGGING_ENDPOINT = "/_synthetic/log_event";
const SESSION_ID_KEY = "synthetic_log_session_id";

let logIdCounter = 0;

/**
 * Get or create a unique session ID for the current browser session
 */
function getSessionId(): string {
  // Try to get existing session ID from sessionStorage
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    // Generate a new session ID
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

/**
 * Main logging function - logs events to the synthetic logging endpoint
 * AL2.1: Standard Function - Single, standardized, asynchronous helper
 * AL2.2: Non-Blocking - Errors are silently handled
 * AL2.3: Session Context - Includes unique session_id
 * AL2.4: Backend Endpoint - Posts to /_synthetic/log_event
 */
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

    // Send to backend asynchronously
    await fetch(LOGGING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(log),
      // Use keepalive to ensure the request completes even if the page unloads
      keepalive: true,
    }).catch((error) => {
      // AL2.2: Silently handle errors - log to console but don't throw
      console.warn("Synthetic logging failed:", error);
    });
  } catch (error) {
    // AL2.2: Silently handle errors - log to console but don't throw
    console.warn("Error creating log event:", error);
  }
}

/**
 * Helper function to log CLICK events
 */
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

/**
 * Helper function to log KEY_PRESS events
 */
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

/**
 * Helper function to log SCROLL events
 */
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

/**
 * Helper function to log GO_TO_URL events
 */
export function logNavigation(text: string, targetUrl: string): void {
  logEvent("GO_TO_URL", {
    text,
    page_url: window.location.href,
    target_url: targetUrl,
  });
}

/**
 * Helper function to log SET_STORAGE events
 */
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

/**
 * Helper function to log CUSTOM events
 */
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

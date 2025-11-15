import { logStorage } from "./index";

/**
 * Wrapper for localStorage that automatically logs SET_STORAGE events
 */
export const trackedLocalStorage = {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  },

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);

    // Log the storage event
    logStorage(`Set localStorage key: ${key}`, "localStorage", key, value);
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);

    // Log the removal as a storage event with empty value
    logStorage(`Removed localStorage key: ${key}`, "localStorage", key, "");
  },

  clear(): void {
    localStorage.clear();

    // Log the clear event
    logStorage("Cleared localStorage", "localStorage", "*", "");
  },

  key(index: number): string | null {
    return localStorage.key(index);
  },

  get length(): number {
    return localStorage.length;
  },
};

/**
 * Wrapper for sessionStorage that automatically logs SET_STORAGE events
 */
export const trackedSessionStorage = {
  getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  },

  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);

    // Log the storage event (excluding session_id to avoid recursive logging)
    if (key !== "synthetic_log_session_id") {
      logStorage(
        `Set sessionStorage key: ${key}`,
        "sessionStorage",
        key,
        value,
      );
    }
  },

  removeItem(key: string): void {
    sessionStorage.removeItem(key);

    // Log the removal
    if (key !== "synthetic_log_session_id") {
      logStorage(
        `Removed sessionStorage key: ${key}`,
        "sessionStorage",
        key,
        "",
      );
    }
  },

  clear(): void {
    sessionStorage.clear();

    // Log the clear event
    logStorage("Cleared sessionStorage", "sessionStorage", "*", "");
  },

  key(index: number): string | null {
    return sessionStorage.key(index);
  },

  get length(): number {
    return sessionStorage.length;
  },
};

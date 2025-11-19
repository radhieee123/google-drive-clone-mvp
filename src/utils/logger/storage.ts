import { logStorage } from "./index";

export const trackedLocalStorage = {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  },

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);

    logStorage(`Set localStorage key: ${key}`, "localStorage", key, value);
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);

    logStorage(`Removed localStorage key: ${key}`, "localStorage", key, "");
  },

  clear(): void {
    localStorage.clear();

    logStorage("Cleared localStorage", "localStorage", "*", "");
  },

  key(index: number): string | null {
    return localStorage.key(index);
  },

  get length(): number {
    return localStorage.length;
  },
};

export const trackedSessionStorage = {
  getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  },

  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);

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

    logStorage("Cleared sessionStorage", "sessionStorage", "*", "");
  },

  key(index: number): string | null {
    return sessionStorage.key(index);
  },

  get length(): number {
    return sessionStorage.length;
  },
};

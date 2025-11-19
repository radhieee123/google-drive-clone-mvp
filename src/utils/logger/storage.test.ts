import { trackedLocalStorage, trackedSessionStorage } from "./storage";
import { logStorage } from "./index";

jest.mock("./index", () => ({
  logStorage: jest.fn(),
}));

describe("trackedLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("setItem", () => {
    it("should log when setting multiple items", () => {
      trackedLocalStorage.setItem("key1", "value1");
      trackedLocalStorage.setItem("key2", "value2");

      expect(logStorage).toHaveBeenCalledTimes(2);
      expect(logStorage).toHaveBeenNthCalledWith(
        1,
        "Set localStorage key: key1",
        "localStorage",
        "key1",
        "value1",
      );
      expect(logStorage).toHaveBeenNthCalledWith(
        2,
        "Set localStorage key: key2",
        "localStorage",
        "key2",
        "value2",
      );
    });
  });

  describe("removeItem", () => {
    it("should remove an item from localStorage and log it", () => {
      localStorage.setItem("testKey", "testValue");
      trackedLocalStorage.removeItem("testKey");

      expect(localStorage.getItem("testKey")).toBeNull();
      expect(logStorage).toHaveBeenCalledWith(
        "Removed localStorage key: testKey",
        "localStorage",
        "testKey",
        "",
      );
    });

    it("should log even when removing non-existent key", () => {
      trackedLocalStorage.removeItem("nonExistent");

      expect(logStorage).toHaveBeenCalledWith(
        "Removed localStorage key: nonExistent",
        "localStorage",
        "nonExistent",
        "",
      );
    });

    it("should remove multiple items", () => {
      localStorage.setItem("key1", "value1");
      localStorage.setItem("key2", "value2");

      trackedLocalStorage.removeItem("key1");
      trackedLocalStorage.removeItem("key2");

      expect(localStorage.getItem("key1")).toBeNull();
      expect(localStorage.getItem("key2")).toBeNull();
      expect(logStorage).toHaveBeenCalledTimes(2);
    });
  });

  describe("clear", () => {
    it("should clear all items from localStorage and log it", () => {
      localStorage.setItem("key1", "value1");
      localStorage.setItem("key2", "value2");

      trackedLocalStorage.clear();

      expect(localStorage.length).toBe(0);
      expect(logStorage).toHaveBeenCalledWith(
        "Cleared localStorage",
        "localStorage",
        "*",
        "",
      );
    });

    it("should log even when localStorage is already empty", () => {
      trackedLocalStorage.clear();

      expect(logStorage).toHaveBeenCalledWith(
        "Cleared localStorage",
        "localStorage",
        "*",
        "",
      );
    });
  });

  describe("length", () => {
    it("should return 0 for empty localStorage", () => {
      expect(trackedLocalStorage.length).toBe(0);
      expect(logStorage).not.toHaveBeenCalled();
    });

    it("should return correct length after removing items", () => {
      localStorage.setItem("key1", "value1");
      localStorage.setItem("key2", "value2");
      localStorage.removeItem("key1");

      expect(trackedLocalStorage.length).toBe(0);
    });

    it("should return 0 after clearing", () => {
      localStorage.setItem("key1", "value1");
      localStorage.clear();

      expect(trackedLocalStorage.length).toBe(0);
    });
  });
});

describe("trackedSessionStorage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe("getItem", () => {
    it("should get synthetic_log_session_id without logging", () => {
      sessionStorage.setItem("synthetic_log_session_id", "test-session-id");
      const result = trackedSessionStorage.getItem("synthetic_log_session_id");

      expect(result).toBe("test-session-id");
      expect(logStorage).not.toHaveBeenCalled();
    });
  });

  describe("setItem", () => {
    it("should log for other keys even when synthetic_log_session_id exists", () => {
      trackedSessionStorage.setItem("synthetic_log_session_id", "test-id");
      trackedSessionStorage.setItem("normalKey", "normalValue");

      expect(logStorage).toHaveBeenCalledTimes(1);
      expect(logStorage).toHaveBeenCalledWith(
        "Set sessionStorage key: normalKey",
        "sessionStorage",
        "normalKey",
        "normalValue",
      );
    });

    it("should handle multiple items with logging", () => {
      trackedSessionStorage.setItem("key1", "value1");
      trackedSessionStorage.setItem("key2", "value2");

      expect(logStorage).toHaveBeenCalledTimes(2);
    });
  });

  describe("removeItem", () => {
    it("should remove an item from sessionStorage and log it", () => {
      sessionStorage.setItem("testKey", "testValue");
      trackedSessionStorage.removeItem("testKey");

      expect(logStorage).toHaveBeenCalledWith(
        "Removed sessionStorage key: testKey",
        "sessionStorage",
        "testKey",
        "",
      );
    });

    it("should log for other keys even when removing alongside synthetic_log_session_id", () => {
      trackedSessionStorage.removeItem("synthetic_log_session_id");
      trackedSessionStorage.removeItem("normalKey");

      expect(logStorage).toHaveBeenCalledTimes(1);
      expect(logStorage).toHaveBeenCalledWith(
        "Removed sessionStorage key: normalKey",
        "sessionStorage",
        "normalKey",
        "",
      );
    });

    it("should log even when removing non-existent key", () => {
      trackedSessionStorage.removeItem("nonExistent");

      expect(logStorage).toHaveBeenCalledWith(
        "Removed sessionStorage key: nonExistent",
        "sessionStorage",
        "nonExistent",
        "",
      );
    });
  });

  describe("clear", () => {
    it("should clear all items from sessionStorage and log it", () => {
      sessionStorage.setItem("key1", "value1");
      sessionStorage.setItem("key2", "value2");

      trackedSessionStorage.clear();

      expect(sessionStorage.length).toBe(0);
      expect(logStorage).toHaveBeenCalledWith(
        "Cleared sessionStorage",
        "sessionStorage",
        "*",
        "",
      );
    });

    it("should log even when clearing synthetic_log_session_id", () => {
      sessionStorage.setItem("synthetic_log_session_id", "test-id");
      trackedSessionStorage.clear();

      expect(logStorage).toHaveBeenCalledWith(
        "Cleared sessionStorage",
        "sessionStorage",
        "*",
        "",
      );
    });

    it("should log even when sessionStorage is already empty", () => {
      trackedSessionStorage.clear();

      expect(logStorage).toHaveBeenCalledWith(
        "Cleared sessionStorage",
        "sessionStorage",
        "*",
        "",
      );
    });
  });

  describe("length", () => {
    it("should return 0 for empty sessionStorage", () => {
      expect(trackedSessionStorage.length).toBe(0);
      expect(logStorage).not.toHaveBeenCalled();
    });

    it("should include synthetic_log_session_id in length", () => {
      sessionStorage.setItem("synthetic_log_session_id", "test-id");
      sessionStorage.setItem("normalKey", "value");

      expect(trackedSessionStorage.length).toBe(0);
    });
  });
});

describe("Integration tests", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("should handle operations across both storage types independently", () => {
    trackedLocalStorage.setItem("localKey", "localValue");
    trackedSessionStorage.setItem("sessionKey", "sessionValue");

    expect(localStorage.getItem("localKey")).toBe(null);
    expect(sessionStorage.getItem("sessionKey")).toBe("test-session-id");
    expect(logStorage).toHaveBeenCalledTimes(2);
  });

  it("should maintain separate storage spaces", () => {
    trackedLocalStorage.setItem("sharedKey", "localValue");
    trackedSessionStorage.setItem("sharedKey", "sessionValue");

    expect(trackedLocalStorage.getItem("sharedKey")).toBe(null);
    expect(trackedSessionStorage.getItem("sharedKey")).toBe("test-session-id");
  });
});

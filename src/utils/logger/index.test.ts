import {
  logEvent,
  logClick,
  logKeyPress,
  logScroll,
  logNavigation,
  logStorage,
  logCustom,
} from "./index";

describe("Logger Module", () => {
  let fetchMock: jest.Mock;
  let consoleWarnSpy: jest.SpyInstance;
  let dateNowSpy: jest.SpyInstance;

  beforeAll(() => {
    Object.defineProperty(global, "window", {
      value: {
        location: {
          href: "https://example.com/test-page",
        },
      },
      writable: true,
      configurable: true,
    });
  });

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    global.fetch = fetchMock;

    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

    dateNowSpy = jest.spyOn(Date, "now").mockReturnValue(1609459200000);

    window.location.href = "https://example.com/test-page";

    sessionStorage.clear();

    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    dateNowSpy.mockRestore();
  });

  describe("Session ID Management", () => {
    it("should reuse existing session ID", async () => {
      await logEvent("CLICK", { text: "test1" });
      const firstSessionId = sessionStorage.getItem("synthetic_log_session_id");

      await logEvent("CLICK", { text: "test2" });
      const secondSessionId = sessionStorage.getItem(
        "synthetic_log_session_id",
      );

      expect(firstSessionId).toBe(secondSessionId);
    });
  });

  describe("logEvent", () => {
    it("should send log event with correct structure", async () => {
      const payload = { text: "Test event", custom_data: "value" };

      await logEvent("CUSTOM", payload);

      expect(fetchMock).toHaveBeenCalledWith(
        "/api/_synthetic/log_event",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          keepalive: true,
        }),
      );

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody).toMatchObject({
        id: expect.any(Number),
        timestamp: expect.any(String),
        session_id: expect.any(String),
        action_type: "CUSTOM",
        payload: payload,
      });
    });

    it("should increment log ID counter for each event", async () => {
      await logEvent("CLICK", { text: "event1" });
      await logEvent("CLICK", { text: "event2" });
      await logEvent("CLICK", { text: "event3" });

      const call1Body = JSON.parse(fetchMock.mock.calls[0][1].body);
      const call2Body = JSON.parse(fetchMock.mock.calls[1][1].body);
      const call3Body = JSON.parse(fetchMock.mock.calls[2][1].body);

      expect(call2Body.id).toBeGreaterThan(call1Body.id);
      expect(call3Body.id).toBeGreaterThan(call2Body.id);
    });

    it("should use ISO format for timestamp", async () => {
      await logEvent("CLICK", { text: "test" });

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it("should handle fetch errors gracefully", async () => {
      fetchMock.mockRejectedValue(new Error("Network error"));

      await logEvent("CLICK", { text: "test" });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Synthetic logging failed:",
        expect.any(Error),
      );
    });

    it("should use keepalive flag for fetch", async () => {
      await logEvent("CLICK", { text: "test" });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          keepalive: true,
        }),
      );
    });

    it("should handle empty payload", async () => {
      await logEvent("CUSTOM", { text: "", custom_action: "TEST" });

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload).toEqual({ text: "", custom_action: "TEST" });
    });

    it("should handle complex nested payload", async () => {
      const complexPayload = {
        text: "Complex event",
        nested: {
          deep: {
            value: "test",
            array: [1, 2, 3],
          },
        },
        numbers: [10, 20, 30],
      };

      await logEvent("CUSTOM", complexPayload);

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload).toEqual(complexPayload);
    });
  });

  describe("logClick", () => {
    it("should log click event with coordinates", async () => {
      logClick("Click button", "#submit-btn", { x: 100, y: 200 });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);

      expect(callBody.action_type).toBe("CLICK");
      expect(callBody.payload).toEqual({
        text: "Click button",
        page_url: "https://example.com/test-page",
        element_identifier: "#submit-btn",
        coordinates: { x: 100, y: 200 },
      });
    });

    it("should use default coordinates when not provided", async () => {
      logClick("Click button", "#submit-btn");

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.coordinates).toEqual({ x: 0, y: 0 });
    });

    it("should handle negative coordinates", async () => {
      logClick("Click button", "#btn", { x: -10, y: -20 });

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.coordinates).toEqual({ x: -10, y: -20 });
    });

    it("should capture current page URL", async () => {
      window.location.href = "https://example.com/different-page";

      logClick("Click", "#element");

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.page_url).toBe(
        "https://example.com/different-page",
      );
    });

    it("should handle empty text", async () => {
      logClick("", "#element", { x: 0, y: 0 });

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.text).toBe("");
    });
  });

  describe("logKeyPress", () => {
    it("should log key press event", async () => {
      logKeyPress("Type in search", "#search-input", "Enter");

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);

      expect(callBody.action_type).toBe("KEY_PRESS");
      expect(callBody.payload).toEqual({
        text: "Type in search",
        page_url: "https://example.com/test-page",
        element_identifier: "#search-input",
        key: "Enter",
      });
    });

    it("should handle special keys", async () => {
      const specialKeys = ["Enter", "Escape", "Tab", "Backspace"];

      specialKeys.forEach((key) => {
        logKeyPress("Key press", "#input", key);
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(fetchMock).toHaveBeenCalledTimes(specialKeys.length);
    });

    it("should handle single character keys", async () => {
      logKeyPress("Type letter", "#input", "a");

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.key).toBe("a");
    });
  });

  describe("logScroll", () => {
    it("should log scroll event with coordinates", async () => {
      logScroll("Scroll page", 0, 500);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);

      expect(callBody.action_type).toBe("SCROLL");
      expect(callBody.payload).toEqual({
        text: "Scroll page",
        page_url: "https://example.com/test-page",
        scroll_x: 0,
        scroll_y: 500,
      });
    });

    it("should handle horizontal scroll", async () => {
      logScroll("Scroll horizontally", 200, 0);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.scroll_x).toBe(200);
      expect(callBody.payload.scroll_y).toBe(0);
    });

    it("should handle negative scroll values", async () => {
      logScroll("Scroll up", 0, -100);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.scroll_y).toBe(-100);
    });

    it("should handle large scroll values", async () => {
      logScroll("Scroll far", 10000, 50000);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.scroll_x).toBe(10000);
      expect(callBody.payload.scroll_y).toBe(50000);
    });
  });

  describe("logNavigation", () => {
    it("should log navigation event", async () => {
      logNavigation("Navigate to home", "https://example.com/home");

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);

      expect(callBody.action_type).toBe("GO_TO_URL");
      expect(callBody.payload).toEqual({
        text: "Navigate to home",
        page_url: "https://example.com/test-page",
        target_url: "https://example.com/home",
      });
    });

    it("should handle relative URLs", async () => {
      logNavigation("Go to about", "/about");

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.target_url).toBe("/about");
    });

    it("should handle URLs with query parameters", async () => {
      logNavigation("Search", "https://example.com/search?q=test&filter=all");

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.target_url).toBe(
        "https://example.com/search?q=test&filter=all",
      );
    });

    it("should handle external URLs", async () => {
      logNavigation("External link", "https://external-site.com");

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.target_url).toBe("https://external-site.com");
    });
  });

  describe("logStorage", () => {
    it("should log localStorage set operation", async () => {
      logStorage("Save user preference", "localStorage", "theme", "dark");

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);

      expect(callBody.action_type).toBe("SET_STORAGE");
      expect(callBody.payload).toEqual({
        text: "Save user preference",
        page_url: "https://example.com/test-page",
        storage_type: "localStorage",
        key: "theme",
        value: "dark",
      });
    });

    it("should log sessionStorage set operation", async () => {
      logStorage("Save session data", "sessionStorage", "tempData", "value123");

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.storage_type).toBe("sessionStorage");
    });

    it("should handle empty value", async () => {
      logStorage("Clear value", "localStorage", "key", "");

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.value).toBe("");
    });

    it("should handle JSON stringified values", async () => {
      const jsonValue = JSON.stringify({ user: "john", id: 123 });
      logStorage("Save user", "localStorage", "user", jsonValue);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.value).toBe(jsonValue);
    });
  });

  describe("logCustom", () => {
    it("should log custom event with data", async () => {
      logCustom("Custom action", "USER_LOGIN", {
        userId: "123",
        method: "oauth",
      });

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);

      expect(callBody.action_type).toBe("CUSTOM");
      expect(callBody.payload).toEqual({
        text: "Custom action",
        custom_action: "USER_LOGIN",
        data: {
          userId: "123",
          method: "oauth",
        },
      });
    });

    it("should handle custom event without data", async () => {
      logCustom("Simple custom event", "BUTTON_CLICKED");

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.data).toBeUndefined();
    });

    it("should handle nested data objects", async () => {
      const complexData = {
        user: {
          id: 123,
          profile: {
            name: "John",
          },
        },
      };

      logCustom("Complex event", "USER_ACTION", complexData);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.data).toEqual(complexData);
    });

    it("should handle arrays in data", async () => {
      logCustom("Event with array", "LIST_ACTION", {
        items: [1, 2, 3, 4, 5],
        tags: ["tag1", "tag2"],
      });

      await new Promise((resolve) => setTimeout(resolve, 0));

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(callBody.payload.data.items).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("Integration scenarios", () => {
    it("should handle multiple different log types in sequence", async () => {
      logClick("Click button", "#btn", { x: 10, y: 10 });
      logKeyPress("Type text", "#input", "a");
      logScroll("Scroll down", 0, 100);
      logNavigation("Go home", "/home");
      logStorage("Save data", "localStorage", "key", "value");
      logCustom("Custom", "ACTION", { data: "test" });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(fetchMock).toHaveBeenCalledTimes(6);

      const actionTypes = fetchMock.mock.calls.map((call) => {
        const body = JSON.parse(call[1].body);
        return body.action_type;
      });

      expect(actionTypes).toEqual([
        "CLICK",
        "KEY_PRESS",
        "SCROLL",
        "GO_TO_URL",
        "SET_STORAGE",
        "CUSTOM",
      ]);
    });

    it("should maintain session ID across multiple log calls", async () => {
      logClick("Click 1", "#btn1");
      logClick("Click 2", "#btn2");
      logClick("Click 3", "#btn3");

      await new Promise((resolve) => setTimeout(resolve, 10));

      const sessionIds = fetchMock.mock.calls.map((call) => {
        const body = JSON.parse(call[1].body);
        return body.session_id;
      });

      expect(sessionIds[0]).toBe(sessionIds[1]);
      expect(sessionIds[1]).toBe(sessionIds[2]);
    });

    it("should continue logging even if some calls fail", async () => {
      fetchMock
        .mockResolvedValueOnce({ ok: true })
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({ ok: true });

      await logClick("Click 1", "#btn1");
      await logClick("Click 2", "#btn2");
      await logClick("Click 3", "#btn3");

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Synthetic logging failed:",
        expect.any(Error),
      );
    });
  });
});

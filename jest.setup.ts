import "@testing-library/jest-dom";

Object.defineProperty(global, "sessionStorage", {
  value: {
    getItem: jest.fn(() => "test-session-id"),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
  },
  writable: true,
  configurable: true,
});

Object.defineProperty(global, "localStorage", {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
  },
  writable: true,
  configurable: true,
});

Object.defineProperty(global.console, "warn", {
  value: jest.fn(),
  writable: true,
  configurable: true,
});

export type ActionType =
  | "CLICK"
  | "KEY_PRESS"
  | "SCROLL"
  | "GO_TO_URL"
  | "SET_STORAGE"
  | "CUSTOM";

export interface ClickPayload {
  text: string;
  page_url: string;
  element_identifier: string;
  coordinates: {
    x: number;
    y: number;
  };
}

export interface KeyPressPayload {
  text: string;
  page_url: string;
  element_identifier: string;
  key: string;
}

export interface ScrollPayload {
  text: string;
  page_url: string;
  scroll_x: number;
  scroll_y: number;
}

export interface GoToUrlPayload {
  text: string;
  page_url: string;
  target_url: string;
}

export interface SetStoragePayload {
  text: string;
  page_url: string;
  storage_type: "localStorage" | "sessionStorage";
  key: string;
  value: string;
}

export interface CustomPayload {
  text: string;
  custom_action: string;
  data?: Record<string, unknown>;
}

export type LogPayload =
  | ClickPayload
  | KeyPressPayload
  | ScrollPayload
  | GoToUrlPayload
  | SetStoragePayload
  | CustomPayload;

export interface Log {
  id: number;
  timestamp: string;
  session_id: string;
  action_type: ActionType;
  payload: LogPayload;
}

export type LogEventInput = Omit<Log, "id" | "timestamp" | "session_id">;

import { localAdapter } from "./local";

export const adapter = {
  local: localAdapter,
} as const;

import "server-only";

import { createHash } from "node:crypto";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function hashDeviceId(deviceId: unknown): string | null {
  if (typeof deviceId !== "string" || !UUID_PATTERN.test(deviceId)) return null;
  return createHash("sha256").update(deviceId).digest("hex");
}

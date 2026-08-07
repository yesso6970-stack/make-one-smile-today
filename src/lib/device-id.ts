const DEVICE_KEY = "make-one-smile:device:v1";
let fallbackDeviceId: string | null = null;

/** Returns a stable anonymous ID for this browser without exposing personal data. */
export function getOrCreateDeviceId(): string {
  try {
    const existing = window.localStorage.getItem(DEVICE_KEY);
    if (existing) return existing;

    const deviceId = window.crypto.randomUUID();
    window.localStorage.setItem(DEVICE_KEY, deviceId);
    return deviceId;
  } catch {
    fallbackDeviceId ??= window.crypto.randomUUID();
    return fallbackDeviceId;
  }
}

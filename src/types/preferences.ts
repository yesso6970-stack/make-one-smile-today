export type ThemePreference = "light" | "dark" | "system";

export interface AppPreferences {
  notifications: boolean;
  reminderTime: string;
  vibration: boolean;
  sound: boolean;
}

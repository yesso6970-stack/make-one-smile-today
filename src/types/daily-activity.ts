export type MissionCategory =
  "family" | "friend" | "work" | "lover" | "stranger" | "self";

export interface DailyMission {
  id: string;
  category: MissionCategory;
  message: string;
}

export interface DailyQuote {
  id: string;
  text: string;
}

export interface PointRule {
  id: "daily" | "streak-7" | "streak-30";
  label: string;
  points: number;
  description: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  requiredDays: number;
  tone: "warm" | "green" | "purple" | "gold";
}

export interface DailyActivityState {
  version: 2;
  missionByDate: Record<string, string>;
  completedDates: string[];
  journalByDate: Record<string, string>;
  points: number;
  awardedMilestones: string[];
  completedCountBaseline: number;
  streakBaseline: number;
}

export interface MissionCompletionResult {
  awardedPoints: number;
  newBadgeIds: string[];
  streak: number;
}

export interface AiSmileIdea {
  id: string;
  message: string;
}

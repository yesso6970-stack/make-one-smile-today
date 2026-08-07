import { relations } from "drizzle-orm";

import {
  aiUsage,
  familyGroups,
  familyMembers,
  friendInvites,
  friendships,
  praiseJournalEntries,
  smileCounters,
  smileEvents,
  userBadges,
  userDailyActivities,
  userPreferences,
  userStats,
  users,
  weeklyReports,
} from "./schema";

// These tables intentionally have no foreign keys: events are an anonymous
// ledger and counters are named aggregates. Future relations belong here.
export const smileEventRelations = relations(smileEvents, () => ({}));
export const smileCounterRelations = relations(smileCounters, () => ({}));
export const praiseJournalEntryRelations = relations(
  praiseJournalEntries,
  () => ({}),
);

export const userRelations = relations(users, ({ many, one }) => ({
  activities: many(userDailyActivities),
  badges: many(userBadges),
  aiUsage: many(aiUsage),
  reports: many(weeklyReports),
  ownedFamilies: many(familyGroups),
  familyMembership: one(familyMembers, {
    fields: [users.id],
    references: [familyMembers.userId],
  }),
  stats: one(userStats),
  preferences: one(userPreferences),
}));

export const userDailyActivityRelations = relations(
  userDailyActivities,
  ({ one }) => ({
    user: one(users, {
      fields: [userDailyActivities.userId],
      references: [users.id],
    }),
  }),
);
export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, { fields: [userStats.userId], references: [users.id] }),
}));
export const userBadgeRelations = relations(userBadges, ({ one }) => ({
  user: one(users, { fields: [userBadges.userId], references: [users.id] }),
}));
export const userPreferenceRelations = relations(
  userPreferences,
  ({ one }) => ({
    user: one(users, {
      fields: [userPreferences.userId],
      references: [users.id],
    }),
  }),
);
export const aiUsageRelations = relations(aiUsage, ({ one }) => ({
  user: one(users, { fields: [aiUsage.userId], references: [users.id] }),
}));
export const weeklyReportRelations = relations(weeklyReports, ({ one }) => ({
  user: one(users, { fields: [weeklyReports.userId], references: [users.id] }),
}));
export const familyGroupRelations = relations(
  familyGroups,
  ({ one, many }) => ({
    owner: one(users, {
      fields: [familyGroups.ownerId],
      references: [users.id],
    }),
    members: many(familyMembers),
  }),
);
export const familyMemberRelations = relations(familyMembers, ({ one }) => ({
  family: one(familyGroups, {
    fields: [familyMembers.familyId],
    references: [familyGroups.id],
  }),
  user: one(users, { fields: [familyMembers.userId], references: [users.id] }),
}));
export const friendInviteRelations = relations(friendInvites, ({ one }) => ({
  inviter: one(users, {
    fields: [friendInvites.inviterId],
    references: [users.id],
    relationName: "inviteSender",
  }),
  acceptedBy: one(users, {
    fields: [friendInvites.acceptedById],
    references: [users.id],
    relationName: "inviteRecipient",
  }),
}));
export const friendshipRelations = relations(friendships, ({ one }) => ({
  user: one(users, {
    fields: [friendships.userId],
    references: [users.id],
    relationName: "friendshipOwner",
  }),
  friend: one(users, {
    fields: [friendships.friendId],
    references: [users.id],
    relationName: "friendshipFriend",
  }),
}));

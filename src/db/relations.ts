import { relations } from "drizzle-orm";

import { smileCounters, smileEvents } from "./schema";

// These tables intentionally have no foreign keys: events are an anonymous
// ledger and counters are named aggregates. Future relations belong here.
export const smileEventRelations = relations(smileEvents, () => ({}));
export const smileCounterRelations = relations(smileCounters, () => ({}));

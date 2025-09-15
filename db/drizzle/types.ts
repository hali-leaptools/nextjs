import { type InferSelectModel } from "drizzle-orm";

import { communitiesTable, roomsTable } from "@/db/drizzle/schema";

export type SelectedRoom = InferSelectModel<typeof roomsTable>;
export type SelectedCommunity = InferSelectModel<typeof communitiesTable>;

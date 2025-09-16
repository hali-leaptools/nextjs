import { eq, like } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { communitiesTable, roomsTable } from "@/db/drizzle/schema";
import { type SelectedRoom } from "@/db/drizzle/types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const queryRooms = async (name?: SelectedRoom["name"]) => {
  await sleep(Math.floor(Math.random() * 5000));
  const query = db.select().from(roomsTable);
  if (name) query.where(like(roomsTable.name, `%${name}%`));
  return query;
};

export const retrieveRoom = async (id: SelectedRoom["id"]) => {
  return db.select().from(roomsTable).where(eq(roomsTable.id, id)).limit(1);
};

export const queryCommunities = async () => {
  return db.select().from(communitiesTable);
};

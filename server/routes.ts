import {
  queryCommunities,
  queryRooms,
  retrieveRoom as retrieveRoomFromDb,
} from "@/db/drizzle/utils";
import type { Route } from "@/server/types";
import { sendJSON } from "@/server/utils";

export const room: Route = {
  method: "GET",
  path: /^\/room\/?$/,
  handler: async ({ res, searchParams }) => {
    const roomName = searchParams.get("name") ?? undefined;
    const room = await queryRooms(roomName);
    sendJSON(res, 200, room);
  },
};

export const communities: Route = {
  method: "GET",
  path: /^\/communities\/?$/,
  handler: async ({ res }) => {
    const communities = await queryCommunities();
    sendJSON(res, 200, communities);
  },
};

export const retrieveRoom: Route = {
  method: "GET",
  path: /^\/room\/(?<id>[^/]+)\/?$/,
  handler: async ({ res, pathParams }) => {
    const id = Number(pathParams.id);

    if (Number.isNaN(id)) {
      sendJSON(res, 400, { error: "Invalid room id" });
      return;
    }

    const room = await retrieveRoomFromDb(id);
    sendJSON(res, 200, room);
  },
};

import http, { IncomingMessage, ServerResponse } from "http";
import { URL } from "url";

import { queryCommunities, queryRooms, retrieveRoom } from "@/db/drizzle/utils";

type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
  params: Record<string, string>,
) => Promise<void>;

type Route = {
  method: string;
  path: RegExp;
  handler: Handler;
};

const sendJSON = (res: ServerResponse, status: number, data: unknown) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const matchRoute = (
  urlPath: string,
  route: Route,
): Record<string, string> | null => {
  const match = route.path.exec(urlPath);
  if (!match) return null;

  const groups: Record<string, string> = {};
  if (match.groups) {
    for (const [key, value] of Object.entries(match.groups)) {
      groups[key] = value;
    }
  }
  return groups;
};

const routes: Route[] = [
  {
    method: "GET",
    path: /^\/room\/(?<name>[^/]+)$/,
    handler: async (_req, res, params) => {
      const room = await queryRooms(params.name);
      sendJSON(res, 200, room);
    },
  },
  {
    method: "GET",
    path: /^\/communities$/,
    handler: async (_req, res) => {
      const communities = await queryCommunities();
      sendJSON(res, 200, communities);
    },
  },
  {
    method: "GET",
    path: /^\/room\/id\/(?<id>[^/]+)$/,
    handler: async (_req, res, params) => {
      const id = Number(params.id);

      if (Number.isNaN(id)) {
        sendJSON(res, 400, { error: "Invalid room id" });
        return;
      }

      const room = await retrieveRoom(id);
      sendJSON(res, 200, room);
    },
  },
];

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url || !req.method) {
      sendJSON(res, 400, { error: "Bad Request" });
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    for (const route of routes) {
      if (req.method === route.method) {
        const params = matchRoute(url.pathname, route);
        if (params) {
          await route.handler(req, res, params);
          return;
        }
      }
    }

    sendJSON(res, 404, { error: "Not Found" });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: "Internal Server Error" });
  }
});

// Accept port from command line, fallback to 3001
const portArgIndex = process.argv.indexOf("--port");
const PORT =
  portArgIndex !== -1 ? Number(process.argv[portArgIndex + 1]) : 3001;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

import http from "http";
import { URL } from "url";

import * as routes from "@/server/routes";
import { findMatchingRoute, sendJSON } from "@/server/utils";

const routeList = Object.values(routes);

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url || !req.method) {
      sendJSON(res, 400, { error: "Bad Request" });
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = url.searchParams;

    const match = findMatchingRoute(req.method, url.pathname, routeList);

    if (match) {
      const { route, pathParams } = match;
      await route.handler({ req, res, searchParams, pathParams });
      return;
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

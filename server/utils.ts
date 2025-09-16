import type { ServerResponse } from "http";

import type { Route } from "@/server/types";

export const sendJSON = (
  res: ServerResponse,
  status: number,
  data: unknown,
) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const extractPathParams = (
  urlPath: string,
  route: Route,
): Record<string, string> | null => {
  const match = route.path.exec(urlPath);
  if (!match) return null;

  return match.groups ? { ...match.groups } : {};
};

export const findMatchingRoute = (
  method: string,
  urlPath: string,
  routes: Route[],
): { route: Route; pathParams: Record<string, string> } | null => {
  for (const route of routes) {
    if (route.method !== method) continue;
    const pathParams = extractPathParams(urlPath, route);
    if (pathParams) {
      return { route, pathParams };
    }
  }
  return null;
};

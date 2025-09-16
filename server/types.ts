import type { IncomingMessage, ServerResponse } from "http";

export type Handler = (args: {
  req: IncomingMessage;
  res: ServerResponse;
  searchParams: URLSearchParams;
  pathParams: Record<string, string>;
}) => Promise<void>;

export type Route = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: RegExp;
  handler: Handler;
};

import type { Hono } from "hono";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isHttpError } from "./ratelimit";

/**
 * Hono app を Vercel Node Functions のハンドラに変換する。
 */
export function toVercelHandler(app: Hono) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const proto = (req.headers["x-forwarded-proto"] as string) || "https";
    const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "localhost";
    const url = `${proto}://${host}${req.url ?? "/"}`;

    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v == null) continue;
      headers.set(k, Array.isArray(v) ? v.join(",") : String(v));
    }

    let body: BodyInit | undefined;
    const method = (req.method ?? "GET").toUpperCase();
    if (method !== "GET" && method !== "HEAD") {
      if (typeof req.body === "string") body = req.body;
      else if (Buffer.isBuffer(req.body)) body = new Uint8Array(req.body);
      else if (req.body != null) body = JSON.stringify(req.body);
    }

    try {
      const webReq = new Request(url, { method, headers, body });
      const webRes = await app.fetch(webReq);
      res.status(webRes.status);
      webRes.headers.forEach((v, k) => res.setHeader(k, v));
      const buf = Buffer.from(await webRes.arrayBuffer());
      res.end(buf);
    } catch (e) {
      const status = isHttpError(e) ? e.status : 500;
      res.status(status);
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ error: (e as Error).message }));
    }
  };
}

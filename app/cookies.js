import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export let returnCookie = createCookie("return-to", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60, // 1 minute because it makes no sense to keep it for a long time
});

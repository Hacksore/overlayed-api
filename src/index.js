import { Router } from "itty-router";
import { fetchAuthToken } from "./util";
const router = Router();

router.get("/oauth/callback", async (request) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const response = await fetchAuthToken(code);  
  const payload = await response.json();

  return new Response(JSON.stringify(payload), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Accept": "application/json"
    },
  });
});

// 404 for everything else
router.all(
  "*",
  () => new Response("Where in the tarnation?!??!", { status: 404 })
);

// eslint-disable-next-line no-restricted-globals
addEventListener("fetch", (event) =>
  event.respondWith(router.handle(event.request))
);

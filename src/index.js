import { Router } from "itty-router";
import { fetchAuthToken, isProd } from "./util";
const router = Router();

router.get("/env", async (request) => {
  return new Response(JSON.stringify({
    dev: !isProd(request.url)
  }), {
    headers: {
      "Content-Type": "application/json"
    },
  });
});

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

// allow our app to request a token
router.post("/token", async (request) => {
  const body = await request.json();
  const response = await fetchAuthToken(body.code, isProd(request.url));  
  const payload = await response.json();

  return new Response(JSON.stringify(payload), {
    // TODO: set proper CORS headers
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

export async function gatherResponse(response) {
  const { headers } = response;
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json());
  } else if (contentType.includes("application/text")) {
    return response.text();
  } else if (contentType.includes("text/html")) {
    return response.text();
  } else {
    return response.text();
  }
}

const REDIRECT_URI_BASE = process.env.NODE_ENV === "production" ? "https://auth.overlayed.dev" : "http://localhost:3000";

export const fetchAuthToken = (code) => {
  const form = new URLSearchParams();
  form.append("client_id", globalThis.CLIENT_ID);
  form.append("client_secret", globalThis.CLIENT_SECRET);
  form.append("grant_type", "authorization_code");
  form.append("code", code); 
  form.append("redirect_uri", `${REDIRECT_URI_BASE}/oauth/callback`);

  return fetch(
    `https://discord.com/api/oauth2/token`,
    {
      method: "POST",
      body: form.toString(),
      headers: {
        "User-Agent": "overlayed-api",
        "Content-Type": "application/x-www-form-urlencoded"
      },
    }
  );
};
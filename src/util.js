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

export const fetchAuthToken = (code, isProd) => {
  console.log("Getting auth token...");
  const baseUrl = isProd ? "https://overlayed.dev" : "http://localhost:8000";

  const form = new URLSearchParams();
  form.append("client_id", globalThis.CLIENT_ID);
  form.append("client_secret", globalThis.CLIENT_SECRET);
  form.append("grant_type", "authorization_code");
  form.append("code", code); 

  // we can just set this to localhost for now?
  form.append("redirect_uri", `${baseUrl}/auth`);

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

export function isProd(url) {
  return url.startsWith("https://auth.");
}
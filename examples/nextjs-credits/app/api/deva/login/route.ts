import { createHash, randomBytes } from "node:crypto";
import { config, saveSession } from "../../../../lib/session";
export async function GET() {
  const { clientId, redirectUri } = config();
  const verifier = randomBytes(32).toString("base64url");
  const state = randomBytes(32).toString("base64url");
  await saveSession({ verifier, state, expiresAt: Date.now() + 600_000 });
  const url = new URL("https://www.deva.me/sso/authorize");
  url.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "OPENID AI_COMPLETIONS",
    state,
    code_challenge: createHash("sha256").update(verifier).digest("base64url"),
    code_challenge_method: "S256",
  }).toString();
  return Response.redirect(url, 303);
}

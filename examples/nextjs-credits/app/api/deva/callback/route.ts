import { exchangeCode } from "@deva-me/login-with-deva/server";
import {
  appOrigin,
  config,
  readSession,
  saveSession,
} from "../../../../lib/session";
export async function GET(request: Request) {
  const session = await readSession();
  const params = new URL(request.url).searchParams;
  const code = params.get("code");
  if (
    !session?.state ||
    !session.verifier ||
    params.get("state") !== session.state ||
    !code
  ) {
    return Response.json({ error: "Invalid login callback" }, { status: 400 });
  }
  const verifier = session.verifier;
  // Consume state before exchange to prevent callback replay.
  delete session.state;
  delete session.verifier;
  try {
    const tokens = await exchangeCode({
      ...config(),
      code,
      codeVerifier: verifier,
    });
    await saveSession({
      accessToken: tokens.access_token,
      expiresAt: Date.now() + Math.min(tokens.expires_in ?? 3600, 3600) * 1000,
    });
    return Response.redirect(appOrigin(), 303);
  } catch {
    return Response.json(
      { error: "Login failed. Please try again." },
      { status: 401 },
    );
  }
}

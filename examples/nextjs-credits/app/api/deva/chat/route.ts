import { createDevaAI, DevaAIError } from "@deva-me/login-with-deva/server";
import { appOrigin, readSession } from "../../../../lib/session";
export async function POST(request: Request) {
  if (request.headers.get("origin") !== appOrigin())
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const session = await readSession();
  if (!session?.accessToken)
    return Response.json({ error: "unauthenticated" }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  if (
    !body ||
    typeof body !== "object" ||
    !("messages" in body) ||
    !Array.isArray(body.messages) ||
    body.messages.length !== 1
  ) {
    return Response.json({ error: "Send one user message" }, { status: 400 });
  }
  const message: unknown = body.messages[0];
  const model = "model" in body ? body.model : "user-default";
  if (
    typeof model !== "string" ||
    !model ||
    !message ||
    typeof message !== "object" ||
    !("role" in message) ||
    message.role !== "user" ||
    !("content" in message) ||
    typeof message.content !== "string" ||
    !message.content.trim() ||
    message.content.length > 8000
  ) {
    return Response.json(
      { error: "Invalid message or model" },
      { status: 400 },
    );
  }
  try {
    const response = await createDevaAI({
      accessToken: session.accessToken,
    }).chat({
      model,
      messages: [{ role: "user", content: message.content }],
      max_tokens: 512,
    });
    return Response.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof DevaAIError ? error.code : "AI request failed",
      },
      { status: error instanceof DevaAIError ? error.status : 502 },
    );
  }
}

import { afterEach, expect, it, vi } from "vitest";
const { jar } = vi.hoisted(() => ({ jar: { get: vi.fn(), set: vi.fn() } }));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => jar }));
import {
  appOrigin,
  config,
  readSession,
  saveSession,
} from "../../examples/nextjs-credits/lib/session";
afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllEnvs();
});
it("keeps tokens in the server store behind an opaque cookie and rotates IDs", async () => {
  vi.stubEnv("APP_ORIGIN", "https://example.com/path");
  const session = {
    accessToken: "server-only",
    expiresAt: Date.now() + 60_000,
  };
  await saveSession(session);
  const id: unknown = jar.set.mock.calls[0]?.[1];
  expect(typeof id).toBe("string");
  expect(id).not.toContain("server-only");
  expect(jar.set).toHaveBeenCalledWith(
    "deva_session",
    id,
    expect.objectContaining({
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    }),
  );
  jar.get.mockReturnValue({ value: id });
  expect(await readSession()).toEqual(session);
  await saveSession({ ...session, accessToken: "rotated" });
  expect(await readSession()).toBeUndefined();
});
it("rejects expired and missing sessions", async () => {
  expect(await readSession()).toBeUndefined();
  await saveSession({ accessToken: "expired", expiresAt: Date.now() - 1000 });
  jar.get.mockReturnValue({ value: jar.set.mock.calls[0]?.[1] as unknown });
  expect(await readSession()).toBeUndefined();
});
it("requires confidential credentials and constructs a fixed callback origin", () => {
  vi.stubEnv("DEVA_CLIENT_ID", "");
  vi.stubEnv("DEVA_CLIENT_SECRET", "");
  expect(config).toThrow("Configure");
  vi.stubEnv("DEVA_CLIENT_ID", "app");
  vi.stubEnv("DEVA_CLIENT_SECRET", "secret");
  vi.stubEnv("APP_ORIGIN", "https://example.com/path");
  expect(appOrigin()).toBe("https://example.com");
  expect(config()).toEqual({
    clientId: "app",
    clientSecret: "secret",
    redirectUri: "https://example.com/api/deva/callback",
  });
});

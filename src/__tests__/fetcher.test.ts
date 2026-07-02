import { describe, expect, it } from "vitest";
import { buildAuthedKey, resolveKeyUrl } from "../lib/fetcher";

describe("resolveKeyUrl", () => {
  it("returns a plain string key unchanged", () => {
    expect(resolveKeyUrl("https://deva.me/userinfo")).toBe(
      "https://deva.me/userinfo",
    );
  });

  it("extracts the url from a [url, token] tuple key", () => {
    // The tuple lets the access token participate in the SWR cache key while
    // only the url is sent to fetch().
    expect(resolveKeyUrl(["https://deva.me/userinfo", "AT1"])).toBe(
      "https://deva.me/userinfo",
    );
  });
});

describe("buildAuthedKey", () => {
  it("is false when the token is missing (SWR must not fetch)", () => {
    expect(buildAuthedKey("https://deva.me/userinfo", null)).toBe(false);
    expect(buildAuthedKey("https://deva.me/userinfo", "")).toBe(false);
  });

  it("is false when the url is missing", () => {
    expect(buildAuthedKey(undefined, "AT1")).toBe(false);
  });

  it("pairs url and token when both are present", () => {
    expect(buildAuthedKey("https://deva.me/userinfo", "AT1")).toEqual([
      "https://deva.me/userinfo",
      "AT1",
    ]);
  });

  it("produces a different key when the token rotates so SWR refetches", () => {
    // This is the crux of the userinfo-rotation fix (agent-key-web#56): when the
    // background refresh rotates AT1 -> AT2, the SWR key must change so the
    // userinfo request re-fires with the new token instead of staying stuck on
    // the revoked one.
    const before = buildAuthedKey("https://deva.me/userinfo", "AT1");
    const after = buildAuthedKey("https://deva.me/userinfo", "AT2");
    expect(before).not.toEqual(after);
  });
});

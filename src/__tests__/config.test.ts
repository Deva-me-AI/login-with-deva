import { describe, expect, it } from "vitest";
import { envToUrl, resolveDevaUrl } from "../config";

describe("resolveDevaUrl", () => {
  it("falls back to the env mapping when no baseUrl is given", () => {
    expect(resolveDevaUrl("production")).toBe(envToUrl("production"));
    expect(resolveDevaUrl("staging")).toBe(envToUrl("staging"));
    expect(resolveDevaUrl("development")).toBe("http://localhost:3000");
  });

  it("uses an explicit baseUrl override regardless of env", () => {
    expect(resolveDevaUrl("production", "http://localhost:3001")).toBe(
      "http://localhost:3001",
    );
    expect(resolveDevaUrl("development", "https://my-tunnel.example")).toBe(
      "https://my-tunnel.example",
    );
  });
});

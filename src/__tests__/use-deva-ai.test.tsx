// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useDevaAI } from "../use-deva-ai";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("posts to the app backend, defaults model, and tracks loading", async () => {
  let resolve!: (response: Response) => void;
  const fetch = vi.fn(
    () =>
      new Promise<Response>((done) => {
        resolve = done;
      }),
  );
  vi.stubGlobal("fetch", fetch);
  const { result } = renderHook(() => useDevaAI());
  expect(result.current).toMatchObject({ loading: false, error: null });
  let request!: ReturnType<typeof result.current.chat>;
  act(() => {
    request = result.current.chat({ messages: [] });
  });
  expect(result.current.loading).toBe(true);
  expect(fetch).toHaveBeenCalledWith(
    "/api/deva/chat",
    expect.objectContaining({
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: '{"model":"user-default","messages":[]}',
    }),
  );
  await act(async () => {
    resolve(Response.json({ model: "actual" }));
    expect(await request).toEqual({ model: "actual" });
  });
  expect(result.current.loading).toBe(false);
});
it("supports a custom app endpoint and explicit model/limit", async () => {
  const fetch = vi.fn().mockResolvedValue(Response.json({}));
  vi.stubGlobal("fetch", fetch);
  const { result } = renderHook(() => useDevaAI({ endpoint: "/api/chat" }));
  await act(async () => {
    await result.current.chat({
      messages: [],
      model: "chosen",
      max_tokens: 20,
    });
  });
  expect(fetch).toHaveBeenCalledWith(
    "/api/chat",
    expect.objectContaining({
      body: '{"model":"chosen","messages":[],"max_tokens":20}',
    }),
  );
});
it.each([
  "https://api.deva.me/v1/chat/completions",
  "//example.com/chat",
  "/\\example.com/chat",
])("rejects foreign endpoint %s", async (endpoint) => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  const { result } = renderHook(() => useDevaAI({ endpoint }));
  await act(async () => {
    await expect(result.current.chat({ messages: [] })).rejects.toThrow(
      "same-origin",
    );
  });
  expect(fetch).not.toHaveBeenCalled();
  expect(result.current.error).toBeInstanceOf(Error);
  expect(result.current.loading).toBe(false);
});
it.each(["http", "network", "json"])(
  "tracks %s errors and clears them on retry",
  async (kind) => {
    const fetch = vi.fn();
    if (kind === "network") fetch.mockRejectedValueOnce(new Error("offline"));
    else
      fetch.mockResolvedValueOnce(
        new Response("invalid", { status: kind === "http" ? 429 : 200 }),
      );
    fetch.mockResolvedValueOnce(Response.json({ model: "ok" }));
    vi.stubGlobal("fetch", fetch);
    const { result } = renderHook(() => useDevaAI());
    await act(async () => {
      await expect(
        result.current.chat({ messages: [] }),
      ).rejects.toBeInstanceOf(Error);
    });
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.loading).toBe(false);
    await act(async () => {
      await result.current.chat({ messages: [] });
    });
    expect(result.current.error).toBeNull();
  },
);
it("keeps loading true until concurrent calls finish", async () => {
  const resolvers: Array<(response: Response) => void> = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise<Response>((resolve) => resolvers.push(resolve))),
  );
  const { result } = renderHook(() => useDevaAI());
  let first!: Promise<unknown>, second!: Promise<unknown>;
  act(() => {
    first = result.current.chat({ messages: [] });
    second = result.current.chat({ messages: [] });
  });
  await act(async () => {
    resolvers[0]!(Response.json({}));
    await first;
  });
  expect(result.current.loading).toBe(true);
  await act(async () => {
    resolvers[1]!(Response.json({}));
    await second;
  });
  expect(result.current.loading).toBe(false);
});

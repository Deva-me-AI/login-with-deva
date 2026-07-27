import { describe, expect, it, vi } from "vitest";
import {
  relaySilentLoginCallback,
  runSilentLoginProbe,
  SILENT_LOGIN_CALLBACK_TYPE,
  silentAttemptStorageKeys,
} from "../lib/silent-login";

type MessageHandler = (event: MessageEvent<unknown>) => void;

function createProbeHarness() {
  let messageHandler: MessageHandler = () => undefined;
  let timeoutHandler: () => void = () => undefined;
  const contentWindow = {} as Window;
  const remove = vi.fn();
  const setAttribute = vi.fn();
  const iframe = {
    contentWindow,
    remove,
    setAttribute,
    src: "",
    style: { display: "" },
    tabIndex: 0,
    title: "",
  } as unknown as HTMLIFrameElement;
  const appendChild = vi.fn();
  const addEventListener = vi.fn(
    (_type: string, listener: EventListenerOrEventListenerObject) => {
      messageHandler = listener as MessageHandler;
    },
  );
  const removeEventListener = vi.fn();
  const clearTimeout = vi.fn();
  const setTimeout = vi.fn((handler: TimerHandler) => {
    timeoutHandler = handler as () => void;
    return 1;
  });
  const browserWindow = {
    addEventListener,
    clearTimeout,
    removeEventListener,
    setTimeout,
  } as unknown as Window;
  const browserDocument = {
    body: { appendChild },
    createElement: vi.fn(() => iframe),
  } as unknown as Document;

  return {
    appendChild,
    browserDocument,
    browserWindow,
    clearTimeout,
    contentWindow,
    emit: (event: Partial<MessageEvent<unknown>>) =>
      messageHandler(event as MessageEvent<unknown>),
    iframe,
    remove,
    removeEventListener,
    setAttribute,
    timeout: () => timeoutHandler(),
  };
}

const probeParams = {
  authorizeUrl: "https://www.deva.me/sso/authorize?prompt=none",
  callbackOrigin: "https://agentkey.deva.me",
  expectedState: "state-123",
  timeoutMs: 5000,
};

describe("runSilentLoginProbe", () => {
  it("creates a hidden iframe and resolves a validated code callback", async () => {
    const harness = createProbeHarness();
    const resultPromise = runSilentLoginProbe({
      ...probeParams,
      browserWindow: harness.browserWindow,
      browserDocument: harness.browserDocument,
    });

    expect(harness.iframe.style.display).toBe("none");
    expect(harness.setAttribute).toHaveBeenCalledWith("aria-hidden", "true");
    expect(harness.iframe.src).toBe(probeParams.authorizeUrl);
    expect(harness.appendChild).toHaveBeenCalledWith(harness.iframe);

    harness.emit({
      data: {
        type: SILENT_LOGIN_CALLBACK_TYPE,
        code: "code-abc",
        state: "state-123",
      },
      origin: "https://agentkey.deva.me",
      source: harness.contentWindow,
    });

    await expect(resultPromise).resolves.toEqual({
      status: "success",
      code: "code-abc",
    });
    expect(harness.remove).toHaveBeenCalledOnce();
    expect(harness.removeEventListener).toHaveBeenCalledOnce();
    expect(harness.clearTimeout).toHaveBeenCalledWith(1);
  });

  it("ignores messages with the wrong origin, source, or state", async () => {
    const harness = createProbeHarness();
    const resultPromise = runSilentLoginProbe({
      ...probeParams,
      browserWindow: harness.browserWindow,
      browserDocument: harness.browserDocument,
    });
    const data = {
      type: SILENT_LOGIN_CALLBACK_TYPE,
      code: "code-abc",
      state: "state-123",
    };

    harness.emit({
      data,
      origin: "https://attacker.example",
      source: harness.contentWindow,
    });
    harness.emit({
      data,
      origin: "https://agentkey.deva.me",
      source: {} as Window,
    });
    harness.emit({
      data: { ...data, state: "wrong-state" },
      origin: "https://agentkey.deva.me",
      source: harness.contentWindow,
    });
    expect(harness.remove).not.toHaveBeenCalled();

    harness.emit({
      data,
      origin: "https://agentkey.deva.me",
      source: harness.contentWindow,
    });
    await expect(resultPromise).resolves.toEqual({
      status: "success",
      code: "code-abc",
    });
  });

  it.each([
    "login_required",
    "consent_required",
    "interaction_required",
  ] as const)("maps %s to no_session", async (error) => {
    const harness = createProbeHarness();
    const resultPromise = runSilentLoginProbe({
      ...probeParams,
      browserWindow: harness.browserWindow,
      browserDocument: harness.browserDocument,
    });

    harness.emit({
      data: {
        type: SILENT_LOGIN_CALLBACK_TYPE,
        error,
        state: "state-123",
      },
      origin: "https://agentkey.deva.me",
      source: harness.contentWindow,
    });

    await expect(resultPromise).resolves.toEqual({
      status: "no_session",
      error,
    });
    expect(harness.remove).toHaveBeenCalledOnce();
    expect(harness.removeEventListener).toHaveBeenCalledOnce();
  });

  it("times out and cleans up", async () => {
    const harness = createProbeHarness();
    const resultPromise = runSilentLoginProbe({
      ...probeParams,
      browserWindow: harness.browserWindow,
      browserDocument: harness.browserDocument,
    });

    harness.timeout();

    await expect(resultPromise).resolves.toEqual({ status: "timeout" });
    expect(harness.remove).toHaveBeenCalledOnce();
    expect(harness.removeEventListener).toHaveBeenCalledOnce();
  });

  it("rejects unexpected OAuth errors after cleanup", async () => {
    const harness = createProbeHarness();
    const resultPromise = runSilentLoginProbe({
      ...probeParams,
      browserWindow: harness.browserWindow,
      browserDocument: harness.browserDocument,
    });

    harness.emit({
      data: {
        type: SILENT_LOGIN_CALLBACK_TYPE,
        error: "server_error",
        error_description: "Identity provider unavailable",
        state: "state-123",
      },
      origin: "https://agentkey.deva.me",
      source: harness.contentWindow,
    });

    await expect(resultPromise).rejects.toThrow(
      "Identity provider unavailable",
    );
    expect(harness.remove).toHaveBeenCalledOnce();
    expect(harness.removeEventListener).toHaveBeenCalledOnce();
  });
});

describe("relaySilentLoginCallback", () => {
  it("posts a code and state to the parent origin from an iframe", () => {
    const postMessage = vi.fn();
    const browserWindow = {
      location: {
        origin: "https://agentkey.deva.me",
        search: "?code=code-abc&state=state-123",
      },
      parent: { postMessage },
    } as unknown as Window;

    expect(relaySilentLoginCallback(browserWindow)).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(
      {
        type: SILENT_LOGIN_CALLBACK_TYPE,
        code: "code-abc",
        state: "state-123",
      },
      "https://agentkey.deva.me",
    );
  });

  it("posts OAuth errors to the parent", () => {
    const postMessage = vi.fn();
    const browserWindow = {
      location: {
        origin: "https://agentkey.deva.me",
        search:
          "?error=login_required&error_description=No+session&state=state-123",
      },
      parent: { postMessage },
    } as unknown as Window;

    expect(relaySilentLoginCallback(browserWindow)).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(
      {
        type: SILENT_LOGIN_CALLBACK_TYPE,
        error: "login_required",
        error_description: "No session",
        state: "state-123",
      },
      "https://agentkey.deva.me",
    );
  });

  it("does nothing for a top-level callback", () => {
    const browserWindow = {
      location: {
        origin: "https://agentkey.deva.me",
        search: "?code=code-abc&state=state-123",
      },
    } as unknown as Window;
    Object.defineProperty(browserWindow, "parent", { value: browserWindow });

    expect(relaySilentLoginCallback(browserWindow)).toBe(false);
  });
});

describe("silentAttemptStorageKeys", () => {
  it("namespaces every attempt away from interactive auth state", () => {
    const first = silentAttemptStorageKeys("state-1");
    const second = silentAttemptStorageKeys("state-2");

    expect(first).toEqual({
      state: "deva_silent_oauth_state:state-1",
      codeVerifier: "deva_silent_code_verifier:state-1",
    });
    expect(first).not.toEqual(second);
    expect(Object.values(first)).not.toContain("oauth_state");
    expect(Object.values(first)).not.toContain("code_verifier");
  });
});

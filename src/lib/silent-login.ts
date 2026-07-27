import type { SilentLoginNoSessionError } from "../DevaContext";

export const SILENT_LOGIN_CALLBACK_TYPE = "deva:silent-login-callback";

type SilentLoginSuccessMessage = {
  type: typeof SILENT_LOGIN_CALLBACK_TYPE;
  code: string;
  state: string;
};

type SilentLoginErrorMessage = {
  type: typeof SILENT_LOGIN_CALLBACK_TYPE;
  error: string;
  error_description?: string;
  state: string;
};

export type SilentLoginCallbackMessage =
  | SilentLoginSuccessMessage
  | SilentLoginErrorMessage;

export type SilentLoginProbeResult =
  | { status: "success"; code: string }
  | { status: "no_session"; error: SilentLoginNoSessionError }
  | { status: "timeout" };

const NO_SESSION_ERRORS: SilentLoginNoSessionError[] = [
  "login_required",
  "consent_required",
  "interaction_required",
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isSilentLoginCallbackMessage = (
  value: unknown,
): value is SilentLoginCallbackMessage => {
  if (
    !isRecord(value) ||
    value.type !== SILENT_LOGIN_CALLBACK_TYPE ||
    typeof value.state !== "string"
  ) {
    return false;
  }

  return (
    (typeof value.code === "string" && value.code.length > 0) ||
    (typeof value.error === "string" && value.error.length > 0)
  );
};

const isNoSessionError = (error: string): error is SilentLoginNoSessionError =>
  NO_SESSION_ERRORS.includes(error as SilentLoginNoSessionError);

/**
 * Relay an OAuth callback loaded inside the silent-login iframe to its parent.
 * Top-level callbacks are left untouched for the normal provider flow.
 */
export function relaySilentLoginCallback(browserWindow: Window): boolean {
  if (browserWindow.parent === browserWindow) {
    return false;
  }

  const params = new URLSearchParams(browserWindow.location.search);
  const state = params.get("state") ?? "";
  const code = params.get("code");
  const error = params.get("error");

  let message: SilentLoginCallbackMessage | null = null;
  if (code) {
    message = {
      type: SILENT_LOGIN_CALLBACK_TYPE,
      code,
      state,
    };
  } else if (error) {
    message = {
      type: SILENT_LOGIN_CALLBACK_TYPE,
      error,
      error_description: params.get("error_description") ?? undefined,
      state,
    };
  }

  if (!message) {
    return false;
  }

  browserWindow.parent.postMessage(message, browserWindow.location.origin);
  return true;
}

/**
 * Navigate a hidden iframe to an authorize URL and wait for its callback page
 * to relay a state-bound result.
 */
export function runSilentLoginProbe(params: {
  authorizeUrl: string;
  callbackOrigin: string;
  expectedState: string;
  timeoutMs: number;
  browserWindow: Window;
  browserDocument: Document;
}): Promise<SilentLoginProbeResult> {
  return new Promise((resolve, reject) => {
    const iframe = params.browserDocument.createElement("iframe");
    iframe.style.display = "none";
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.title = "Deva silent sign-in";

    let settled = false;

    const cleanup = () => {
      params.browserWindow.clearTimeout(timeoutId);
      params.browserWindow.removeEventListener("message", onMessage);
      iframe.remove();
    };

    const finish = (): boolean => {
      if (settled) return false;
      settled = true;
      cleanup();
      return true;
    };

    const resolveProbe = (result: SilentLoginProbeResult) => {
      if (finish()) resolve(result);
    };

    const rejectProbe = (error: Error) => {
      if (finish()) reject(error);
    };

    const onMessage = (event: MessageEvent<unknown>) => {
      if (
        event.origin !== params.callbackOrigin ||
        event.source !== iframe.contentWindow ||
        !isSilentLoginCallbackMessage(event.data) ||
        event.data.state !== params.expectedState
      ) {
        return;
      }

      if ("code" in event.data) {
        resolveProbe({ status: "success", code: event.data.code });
        return;
      }

      if (isNoSessionError(event.data.error)) {
        resolveProbe({ status: "no_session", error: event.data.error });
        return;
      }

      rejectProbe(
        new Error(
          event.data.error_description ??
            `Silent login failed: ${event.data.error}`,
        ),
      );
    };

    params.browserWindow.addEventListener("message", onMessage);
    const timeoutId = params.browserWindow.setTimeout(
      () => resolveProbe({ status: "timeout" }),
      params.timeoutMs,
    );

    iframe.src = params.authorizeUrl;
    try {
      params.browserDocument.body.appendChild(iframe);
    } catch (error) {
      rejectProbe(
        error instanceof Error
          ? error
          : new Error("Unable to create the silent login iframe"),
      );
    }
  });
}

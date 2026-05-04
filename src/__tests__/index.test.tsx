import { renderToString } from "react-dom/server";
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import {
  DevaProvider,
  useDeva,
  type DevaContext as PublicDevaContext,
  type Envs,
  type UserInfo,
} from "../index";
import { DevaContext } from "../DevaContext";

function UseDevaProbe({
  onRead,
}: {
  onRead: (value: ReturnType<typeof useDeva>) => void;
}) {
  onRead(useDeva());
  return null;
}

describe("SDK public exports", () => {
  it("exports the main runtime API", () => {
    expect(typeof DevaProvider).toBe("function");
    expect(typeof useDeva).toBe("function");
  });

  it("keeps expected public type exports", () => {
    expectTypeOf<Envs>().toEqualTypeOf<
      "development" | "staging" | "production"
    >();
    expectTypeOf<PublicDevaContext["user"]>().toEqualTypeOf<UserInfo | null>();
  });

  it("throws a clear error when useDeva is used outside provider", () => {
    expect(() => {
      renderToString(<UseDevaProbe onRead={() => undefined} />);
    }).toThrowError("useDeva must be used within a DevaProvider");
  });

  it("returns auth/session helpers from context via useDeva", async () => {
    const login = vi.fn(async () => undefined);
    const logout = vi.fn(async () => undefined);
    const contextValue: PublicDevaContext = {
      clientId: "client",
      redirectUri: "https://example.com/callback",
      env: "staging",
      authInProgress: false,
      authError: null,
      login,
      logout,
      idToken: null,
      accessToken: "token-123",
      refreshToken: "refresh-123",
      user: null,
      isAuthenticated: true,
      isReady: true,
      url: "https://staging.deva.me",
    };

    let result: ReturnType<typeof useDeva> | undefined;
    renderToString(
      <DevaContext.Provider value={contextValue}>
        <UseDevaProbe onRead={(value) => (result = value)} />
      </DevaContext.Provider>,
    );

    expect(result).toBeDefined();
    expect(result?.isAuthenticated).toBe(true);
    expect(result?.accessToken).toBe("token-123");
    await result?.login();
    await result?.logout();
    expect(login).toHaveBeenCalledTimes(1);
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it("renders DevaProvider and exposes helper functions to children", () => {
    const html = renderToString(
      <DevaProvider
        clientId="client"
        redirectUri="https://example.com/callback"
        env="staging"
      >
        {({ isAuthenticated, login, logout }) => (
          <span>
            {`${String(isAuthenticated)}|${typeof login}|${typeof logout}`}
          </span>
        )}
      </DevaProvider>,
    );

    expect(html).toContain("|function|function");
  });
});

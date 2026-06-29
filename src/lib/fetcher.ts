import useSWR, { type Key, type SWRConfiguration } from "swr";

export const fetcher = <T>(...args: Parameters<typeof fetch>): Promise<T> =>
  fetch(...args).then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json() as Promise<T>;
  });

/**
 * SWR v2 hands the fetcher the whole key. We use tuple keys like
 * `[url, accessToken]` so a rotated token changes the cache key (forcing a
 * refetch) while only the url is passed to fetch(). Plain string keys pass
 * through unchanged.
 */
export const resolveKeyUrl = (key: unknown): string => {
  const url: unknown = Array.isArray(key) ? (key[0] as unknown) : key;
  if (typeof url !== "string") {
    throw new Error(
      "useSWRFetcher: key must be a url string or a [url, ...] tuple",
    );
  }
  return url;
};

/**
 * Build an SWR key that carries the bearer token so a rotated token produces a
 * new key and SWR refetches instead of serving the stale (revoked-token)
 * result. Returns `false` when either piece is missing so SWR skips the fetch.
 */
export const buildAuthedKey = (
  url: string | undefined,
  token: string | null | undefined,
): [string, string] | false => (token && url ? [url, token] : false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useSWRFetcher = <T = any, Error = any>(
  key: Key,
  init?: RequestInit,
  config?: SWRConfiguration<T, Error>,
) => {
  return useSWR<T, Error>(
    key,
    async (resolvedKey: Key) => fetcher<T>(resolveKeyUrl(resolvedKey), init),
    config,
  );
};

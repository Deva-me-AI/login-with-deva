import useSWR, { type Key, type SWRConfiguration } from "swr";

export const fetcher = <T>(...args: Parameters<typeof fetch>): Promise<T> =>
  fetch(...args).then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json() as Promise<T>;
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useSWRFetcher = <T = any, Error = any>(
  key: Key,
  init?: RequestInit,
  config?: SWRConfiguration<T, Error>,
) => {
  return useSWR<T, Error>(
    key,
    async (url: string) => fetcher<T>(url, init),
    config,
  );
};

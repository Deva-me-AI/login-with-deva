export const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
};

export const base64URLEncode = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const generateCodeChallenge = async (
  verifier: string,
): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(digest);
};

export const epochAtSecondsFromNow = (secondsFromNow: number | string) =>
  Math.round(Date.now() / 1000 + Number(secondsFromNow))

export const epochTimeIsPast = (timestamp: number): boolean =>
  (Math.round(Date.now()) / 1000) + 30 >= timestamp;

import crypto from "crypto";

export class HashingLibrary {
  private secret: string;

  constructor(secretKey?: string) {
    this.secret = secretKey ?? process.env.LIBRARY_SECRET ?? "default_secret";
  }

  createHash(message: string): string {
    const hash = crypto.createHash("sha256");
    hash.update(message + this.secret);
    return hash.digest("hex");
  }
}

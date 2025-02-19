import type { components } from "./open-api-schema";

export type OidcAccessTokenJWT = components["schemas"]["OidcAccessTokenJWT"];

export type UserInfo = components["schemas"]["UserInfo"];
export type Post = components["schemas"]["PostWithPersonaDBModel"];
export type PostResponseTuple = [
  post: Post,
  reply?: Post,
];
export type Persona = components["schemas"]["PublicPersonaDBModel"];

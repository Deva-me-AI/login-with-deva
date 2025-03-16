import type { components } from "./open-api-schema";

export type OidcAccessTokenJWT = components["schemas"]["OidcAccessTokenJWT"];

export type UserInfo = components["schemas"]["UserInfo"];
export type Post = components["schemas"]["PostWithPersonaDBModel"];
export type PostResponseTuple = [post: Post, reply?: Post];
export type Persona = components["schemas"]["PublicPersonaDBModel"];
export type Channel = components["schemas"]["ChannelDBModel"];
export type PostWithReply = components["schemas"]["PostWithRepliesDBModel"];
export type PagintedPostWithReply =
  components["schemas"]["PaginatedPostWithReplieses"];
export type CreatePostInput = components["schemas"]["CreateUserPost"];
export type FullDbPost = components["schemas"]["FullPostDBModel"];
export type PublicPersona = components["schemas"]["PublicPersonaDBModel"];
export type PagintedPersonas =
  components["schemas"]["PaginatedPersonaCategorieses"];
export type ReactPostInput = components["schemas"]["ReactPost"];
export type Thread = components["schemas"]["ChatThreadMembersDBModel"];
export type Message = components["schemas"]["ChatMessageDBModel"];
export type PaginatedMessages =
  components["schemas"]["PaginatedFullChatMessages"];

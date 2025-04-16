import type { components } from "./open-api-schema";

export type OidcAccessTokenJWT = components["schemas"]["OidcAccessTokenJWT"];

export type UserPersonaInfo = components["schemas"]["UserPersonaInfo"];
export type UserInfo = components["schemas"]["UserInfo"] & {
  persona: UserPersonaInfo
};
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

// chat
export type Thread = components["schemas"]["ChatThreadMembersDBModel"];
export type Message = components["schemas"]["FullChatMessageDBModel"];
export type PaginatedMessages =
  components["schemas"]["PaginatedFullChatMessages"];
export type ChatMessageAuthor = components["schemas"]["MessageAuthorType"];
export type PostChatInput = components["schemas"]["CreateUserChatMessage"];

export type ChatLLMQueryStreamTypes =
  | "completion"
  | "llm_response"
  | "content"
  | "error"
  | "response_message";

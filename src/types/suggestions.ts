import type { PublicPersona } from "@/server";

export type Suggestion = {
  id: string;
  // used by remirror as the text inside the mention and eventually bubbles up
  // to our notes editor in getMentions
  label: string;
  // used to display the suggestion in the dropdown
  // we use this to add context to the menu, although label is used internally
  // by remirror
  content: string;
  // used by remirror to determine how much of the text to replace with the suggestion
  // use partial to split the mention at the cursor and preserve the text after the cursor
  // replacing the content before the cursor by label
  replacementType?: "full" | "partial";
  persona: PublicPersona;
};

export interface FetchSuggestionsOptions {
  query?: string;
  type?: "mention" | "devaResponse";
  limit?: number;
}
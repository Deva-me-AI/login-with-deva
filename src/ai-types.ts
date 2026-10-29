/** Non-streaming OpenAI-compatible chat input. */
export type DevaChatInput = {
  model?: string;
  messages: Array<{
    role: "system" | "user" | "assistant" | "tool";
    content: string | null;
    name?: string;
    tool_call_id?: string;
  }>;
  max_tokens?: number;
};
export type DevaChatResponse = {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: "assistant"; content: string | null };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};
export type DevaModels = {
  object: "list";
  data: Array<{
    id: string;
    object: "model";
    created?: number;
    owned_by?: string;
  }>;
};
export type DevaAllowance = {
  monthly_cap_usd: number;
  spent_usd_this_period: number;
  remaining_usd: number;
  period_end: string;
};

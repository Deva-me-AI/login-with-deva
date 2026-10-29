/** Use only on your backend. Never serialize this client's access token to a browser. */
export declare function createDevaAI({ accessToken, baseUrl, }: {
    accessToken: string;
    baseUrl?: string;
}): {
    chat: ({ model, messages, max_tokens }: DevaChatInput) => Promise<DevaChatResponse>;
    models: () => Promise<DevaModels>;
    allowance: () => Promise<DevaAllowance>;
};

export declare class DevaAIError extends Error {
    readonly code: DevaAIErrorCode;
    readonly status: number;
    readonly name = "DevaAIError";
    constructor(code: DevaAIErrorCode, status: number);
}

export declare type DevaAIErrorCode = "unauthenticated" | "missing_scope" | "app_budget_exceeded" | "insufficient_credits" | "rate_limited";

export declare type DevaAllowance = {
    monthly_cap_usd: number;
    spent_usd_this_period: number;
    remaining_usd: number;
    period_end: string;
};

/** Non-streaming OpenAI-compatible chat input. */
export declare type DevaChatInput = {
    model?: string;
    messages: Array<{
        role: "system" | "user" | "assistant" | "tool";
        content: string | null;
        name?: string;
        tool_call_id?: string;
    }>;
    max_tokens?: number;
};

export declare type DevaChatResponse = {
    id: string;
    object: "chat.completion";
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: "assistant";
            content: string | null;
        };
        finish_reason: string | null;
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
};

export declare type DevaModels = {
    object: "list";
    data: Array<{
        id: string;
        object: "model";
        created?: number;
        owned_by?: string;
    }>;
};

export declare type DevaTokenResponse = {
    access_token: string;
    token_type: string;
    expires_in?: number;
    refresh_token?: string;
    id_token?: string;
    scope?: string;
};

/** Exchange a server callback's validated authorization code using PKCE. */
export declare function exchangeCode({ clientId, clientSecret, code, codeVerifier, redirectUri, tokenEndpoint, }: {
    clientId: string;
    clientSecret: string;
    code: string;
    codeVerifier: string;
    redirectUri: string;
    tokenEndpoint?: string;
}): Promise<DevaTokenResponse>;

export { }


declare namespace v3 {
    var DNS: string;
    var URL: string;
}


declare namespace v5 {
    var DNS: string;
    var URL: string;
}



declare global {
    interface Node {
        pmViewDesc?: ViewDesc;
    }
}



// Register nodes in content.
declare module 'hast' {
  interface ElementData {
    /**
     * Custom info relating to the node, if `<code>` in `<pre>`.
     *
     * Defined by `mdast-util-to-hast` (`remark-rehype`).
     */
    meta?: string | null | undefined
  }

  interface ElementContentMap {
    /**
     * Raw string of HTML embedded into HTML AST.
     */
    raw: Raw
  }

  interface RootContentMap {
    /**
     * Raw string of HTML embedded into HTML AST.
     */
    raw: Raw
  }
}



// Register data on mdast.
declare module 'mdast' {
  interface Data {
    /**
     * Field supported by `mdast-util-to-hast` to signal that a node should
     * result in something with these children.
     *
     * When this is defined, when a parent is created, these children will
     * be used.
     */
    hChildren?: ElementContent[] | undefined

    /**
     * Field supported by `mdast-util-to-hast` to signal that a node should
     * result in a particular element, instead of its default behavior.
     *
     * When this is defined, an element with the given tag name is created.
     * For example, when setting `hName` to `'b'`, a `<b>` element is created.
     */
    hName?: string | undefined

    /**
     * Field supported by `mdast-util-to-hast` to signal that a node should
     * result in an element with these properties.
     *
     * When this is defined, when an element is created, these properties will
     * be used.
     */
    hProperties?: Properties | undefined
  }
}



/**
 * Augment types.
 */
declare module 'micromark-util-types' {
  /**
   * Compile data.
   */
  interface CompileData {
    gfmFootnoteDefinitions?: Record<string, string>
    gfmFootnoteDefinitionStack?: Array<string>
    gfmFootnoteCallCounts?: Record<string, number>
    gfmFootnoteCallOrder?: Array<string>
  }

  /**
   * Parse context.
   */
  interface ParseContext {
    gfmFootnotes?: Array<string>
  }

  /**
   * Token types.
   */
  interface TokenTypeMap {
    gfmFootnoteCall: 'gfmFootnoteCall'
    gfmFootnoteCallLabelMarker: 'gfmFootnoteCallLabelMarker'
    gfmFootnoteCallMarker: 'gfmFootnoteCallMarker'
    gfmFootnoteCallString: 'gfmFootnoteCallString'
    gfmFootnoteDefinition: 'gfmFootnoteDefinition'
    gfmFootnoteDefinitionIndent: 'gfmFootnoteDefinitionIndent'
    gfmFootnoteDefinitionLabel: 'gfmFootnoteDefinitionLabel'
    gfmFootnoteDefinitionLabelMarker: 'gfmFootnoteDefinitionLabelMarker'
    gfmFootnoteDefinitionLabelString: 'gfmFootnoteDefinitionLabelString'
    gfmFootnoteDefinitionMarker: 'gfmFootnoteDefinitionMarker'
    gfmFootnoteDefinitionWhitespace: 'gfmFootnoteDefinitionWhitespace'
  }
}



declare module 'micromark-util-types' {
  interface TokenTypeMap {
    strikethroughSequence: 'strikethroughSequence'
    strikethroughSequenceTemporary: 'strikethroughSequenceTemporary'
    strikethrough: 'strikethrough'
    strikethroughText: 'strikethroughText'
  }
}



declare module 'micromark-util-types' {
  interface TokenTypeMap {
    listItem: 'listItem'
  }

  interface Token {
    _spread?: boolean
  }
}



declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    /**
     * Footnote definition.
     *
     * ```markdown
     * > | [^a]: B.
     *     ^^^^^^^^
     * ```
     */
    footnoteDefinition: 'footnoteDefinition'

    /**
     * Footnote reference.
     *
     * ```markdown
     * > | A[^b].
     *      ^^^^
     * ```
     */
    footnoteReference: 'footnoteReference'
  }
}



// Add custom data tracked to turn markdown into a tree.
declare module 'mdast-util-from-markdown' {
  interface CompileData {
    /**
     * Whether we’re currently in a table.
     */
    inTable?: boolean | undefined
  }
}



// Add custom data tracked to turn a syntax tree into markdown.
declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    /**
     * Whole table.
     *
     * ```markdown
     * > | | a |
     *     ^^^^^
     * > | | - |
     *     ^^^^^
     * ```
     */
    table: 'table'

    /**
     * Table cell.
     *
     * ```markdown
     * > | | a |
     *     ^^^^^
     *   | | - |
     * ```
     */
    tableCell: 'tableCell'

    /**
     * Table row.
     *
     * ```markdown
     * > | | a |
     *     ^^^^^
     *   | | - |
     * ```
     */
    tableRow: 'tableRow'
  }
}

declare namespace _default {
    namespace plugins {
        let tailwindcss: {};
    }
}

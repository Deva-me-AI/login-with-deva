import { JSX } from 'react';

export declare function ChannelFeed({ handle }: ChannelFeedProps): JSX.Element;

declare interface ChannelFeedProps {
    handle?: string;
}

export declare const Intercom: ({ username, fetchOnMount, }: {
    username: string;
    fetchOnMount?: boolean;
}) => JSX.Element | null;

export declare function Toaster(): JSX.Element;

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



declare module 'micromark-util-types' {
  interface TokenTypeMap {
    strikethroughSequence: 'strikethroughSequence'
    strikethroughSequenceTemporary: 'strikethroughSequenceTemporary'
    strikethrough: 'strikethrough'
    strikethroughText: 'strikethroughText'
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



declare module 'micromark-util-types' {
  interface TokenTypeMap {
    listItem: 'listItem'
  }

  interface Token {
    _spread?: boolean
  }
}

declare namespace _default {
    namespace plugins {
        let tailwindcss: {};
    }
}

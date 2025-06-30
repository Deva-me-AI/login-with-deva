import { type Editor, type Range, Node, mergeAttributes } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import type { SuggestionOptions } from "@tiptap/suggestion";
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { PluginKey } from "prosemirror-state";

export type MentionAttributes = {
  id: string;
  label: string;
};

export type BaseMentionOptions = {
  HTMLAttributes: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  renderLabel: (props: {
    options: BaseMentionOptions;
    node: ProseMirrorNode;
  }) => string;
  suggestion: Omit<SuggestionOptions, "editor">;
};

export function createMentionNode(config: {
  name: string;
  char: string;
  pluginKey: PluginKey;
}) {
  return Node.create<BaseMentionOptions>({
    name: config.name,

    addOptions() {
      return {
        HTMLAttributes: {},
        renderLabel({ options, node }) {
          return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
        },
        suggestion: {
          char: config.char,
          pluginKey: config.pluginKey,
          command: ({ editor, range, props }: { editor: Editor; range: Range; props: MentionAttributes }) => {
            const { nodeAfter } = editor.view.state.selection.$to;
            const overrideSpace = nodeAfter?.text?.startsWith(" ");

            if (overrideSpace) {
              range.to += 1;
            }

            editor
              .chain()
              .focus()
              .insertContentAt(range, [
                {
                  type: this.name,
                  attrs: props,
                },
                {
                  type: "text",
                  text: "\u00A0"
                },
              ])
              .run();

            window.getSelection()?.collapseToEnd();
          },
          allow: ({ state, range }) => {
            const $from = state.doc.resolve(range.from);
            const type = state.schema.nodes[this.name];
            return type ? !!$from.parent.type.contentMatch.matchType(type) : false;
          },
        },
      };
    },

    group: "inline",
    inline: true,
    selectable: false,
    atom: true,

    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute("data-id"),
          renderHTML: (attributes: MentionAttributes) => {
            if (!attributes.id) {
              return {};
            }
            return {
              "data-id": attributes.id,
            };
          },
        },
        label: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute("data-label"),
          renderHTML: (attributes: MentionAttributes) => {
            if (!attributes.label) {
              return {};
            }
            return {
              "data-label": attributes.label,
            };
          },
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: `span[data-type="${this.name}"]`,
        },
      ];
    },

    renderHTML({ node, HTMLAttributes }) {
      return [
        "span",
        mergeAttributes(
          { "data-type": this.name },
          this.options.HTMLAttributes,
          HTMLAttributes,
        ),
        this.options.renderLabel({
          options: this.options,
          node,
        }),
      ];
    },

    renderText({ node }) {
      return this.options.renderLabel({
        options: this.options,
        node,
      });
    },

    addKeyboardShortcuts() {
      return {
        Backspace: () =>
          this.editor.commands.command(({ tr, state }) => {
            let isMention = false;
            const { selection } = state;
            const { empty, anchor } = selection;

            if (!empty) {
              return false;
            }

            state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
              if (node.type.name === this.name) {
                isMention = true;
                tr.insertText(
                  this.options.suggestion.char ?? "",
                  pos,
                  pos + node.nodeSize,
                );
                return false;
              }
            });

            return isMention;
          }),
      };
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ];
    },
  });
}

import tippy, { type Instance } from "tippy.js";
import { ReactRenderer } from "@tiptap/react";
import { MentionsList } from "./MentionsList";
import { fetchSuggestions } from "@/lib/fetch-suggestions";
import type { Envs } from "@/config";
import type { SuggestionOptions } from "@tiptap/suggestion";

const usePersonaSuggester = (
  id: string,
  env: Envs,
  type: "deva" | "human",
): Omit<SuggestionOptions, "editor"> => {
  let component: ReactRenderer | undefined;
  let popup: Instance[] | undefined;

  return {
    items: async ({ query }) => {
      if (!component) {
        return [];
      }

      return await fetchSuggestions(env, {
        query,
        type: type === "human" ? "mention" : "devaResponse",
        limit: 20,
      });
    },

    render: () => {
      return {
        onStart: (props) => {
          component = new ReactRenderer(MentionsList, {
            props: {
              ...props,
              human: type === "human",
              loading: false,
            },
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy(`#${id}`, {
            getReferenceClientRect: props.clientRect as () => DOMRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            maxWidth: "none",
            placement: "bottom-start",
            popperOptions: {
              modifiers: [
                {
                  name: "sameWidth",
                  enabled: true,
                  phase: "beforeWrite",
                  requires: ["computeStyles"],
                  fn: ({ state }) => {
                    if (!state?.styles?.popper) {
                      return;
                    }

                    if (window.innerWidth <= (type === "deva" ? 640 : 540)) {
                      state.styles.popper.width = `${window.innerWidth}px`;
                      state.styles.popper.left = "-5px";
                    }
                  },
                  effect: ({ state }) => {
                    if (window.innerWidth <= (type === "deva" ? 640 : 540)) {
                      state.elements.popper.style.width = `${window.innerWidth}px`;
                      state.elements.popper.style.left = "-5px";
                    }
                  },
                },
              ],
            },
          });
        },

        onUpdate(props) {
          component?.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          if (popup) {
            popup?.[0]?.setProps({
              // @ts-expect-error getReferenceClientRect
              getReferenceClientRect: props.clientRect,
            });
          }
        },

        onKeyDown(props) {
          if (props.event.key === "Escape") {
            if (popup) {
              popup?.[0]?.hide();
            }
            return true;
          }

          if (props.event.key === "Enter") {
            // @ts-expect-error onKeyDown is not defined in the type
            const handled = component?.ref?.onKeyDown(props) as boolean; // eslint-disable-line @typescript-eslint/no-unsafe-call
            if (handled) {
              // Don't try to hide - the selection process will handle cleanup
              return true;
            }
          }

          // @ts-expect-error onKeyDown is not defined in the type
          return component?.ref?.onKeyDown(props) as boolean; // eslint-disable-line @typescript-eslint/no-unsafe-call
        },

        onExit() {
          if (!popup?.[0]) {
            console.warn(
              `%c${type}Suggestion/render#onExit`,
              "color:salmon;",
              "NO POPUP! Indicative of race condition in mention renderer.",
            );
            return;
          } else {
            popup[0].destroy();
          }
          component?.destroy();
          component = undefined;
        },
      };
    },
  };
};

export default usePersonaSuggester;

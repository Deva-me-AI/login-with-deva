import tippy from "tippy.js";
import { ReactRenderer } from "@tiptap/react";
import { MentionsList } from "./MentionsList";

const SEARCH_DEBOUNCE_DELAY_MS = 200;

const usePersonaSuggester = () => {
  const onCreatePersonaSuggester = (
    type: "deva" | "human",
    options: SuggestionOptions= {},
  ) => {
    let lastQuery = "";
    let lastItems: Suggestion[] = [];
    let component;
    let popup;
    let listenerId: Id | undefined;

    const suggestion = {
      items: async ({ query }) => {
        if (!component) {
          lastQuery = query;
          return [];
        }

        const data = await mentionsStore.getHandles(query, {
          type,
          skip: query === lastQuery ? lastItems.length : undefined,
          limit: 20,
        });

        // @todo This concat logic was used to have pagination, we may need to
        // rewrite how this works since the store is considered source of truth
        // and we don't want additional state hanging out over here
        //
        // if (query === lastQuery) lastItems = lastItems.concat(data || []);
        // else lastItems = data || [];

        lastItems = data || [];
        lastQuery = query;
        return lastItems;
      },

      render: () => {
        const { tippyProps = {} } = options;

        const renderer = {
          onStart: (props) => {
            component = new ReactRenderer(MentionsList, {
              props: {
                ...props,
                human: type === "human",
                loading: false,
                fetchNext: debounce(async () => {
                  fetchSuggestions();
                }, SEARCH_DEBOUNCE_DELAY_MS),
              },
              editor: props.editor,
            });

            if (!props.clientRect) {
              return;
            }

            popup = tippy("#postInput", {
              getReferenceClientRect: props.clientRect,
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
              ...tippyProps,
            });

            fetchSuggestions();
          },

          onUpdate(props) {
            component?.updateProps(props);

            if (!props.clientRect) {
              return;
            }

            if (popup) {
              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            }
          },

          onKeyDown(props) {
            if (props.event.key === "Escape") {
              if (popup) {
                popup[0].hide();
              }
              return true;
            }

            if (props.event.key === "Enter") {
              const handled = component?.ref?.onKeyDown(props);
              if (handled) {
                // Don't try to hide - the selection process will handle cleanup
                return true;
              }
            }

            return component?.ref?.onKeyDown(props);
          },

          onShow: (props) => {
            // If a user deletes the @ symbol quickly after
            // typing it, the node we want to append the popup
            // to won't exist so we check to ensure it is there
            // prior to mounting the popup to the DOM
            try {
              props.clientRect?.();
            } catch {
              return false;
            }
          },

          onExit() {
            if (!popup) {
              console.warn(
                `%c${type}Suggestion/render#onExit`,
                "color:salmon;",
                "NO POPUP! Indicative of race condition in mention renderer.",
              );
            }
            popup?.[0]?.destroy();
            component?.destroy();
            component = undefined;
          },
        };

        const fetchSuggestions = () => {
          console.debug(
            `%c${type}Suggestion/render#fetchSuggestions`,
            "color:salmon;",
          );
          renderer.onUpdate({ loading: true });
          suggestion
            .items({ query: lastQuery || "" })
            .then((items) => {
              renderer.onUpdate({ items, loading: false });
            })
            .catch((error) => {
              console.error("Error fetching suggestions:", error);
              toast.error("Error fetching suggestions");
              renderer.onUpdate({ items: [], loading: false });
            });
        };

        return renderer;
      },
    };

    return suggestion;
  };

  return {
    onCreatePersonaSuggester
  }
}

export default usePersonaSuggester

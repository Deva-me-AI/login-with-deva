import { useEventListener } from "./use-event-listener";
import { useCallback, type RefObject } from "react";

type EventType =
  | "mousedown"
  | "mouseup"
  | "touchstart"
  | "touchend"
  | "focusin"
  | "focusout";

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: EventType = "mousedown",
  eventListenerOptions: AddEventListenerOptions = {},
): void {
  const cb = useCallback(
    (event: MouseEvent | TouchEvent | FocusEvent) => {
      const target = event.target as Node;

      // Do nothing if the target is not connected element with document
      if (!target?.isConnected) {
        return;
      }

      const isOutside = Array.isArray(ref)
        ? ref
            .filter((r) => Boolean(r.current))
            .every((r) => r.current && !r.current.contains(target))
        : ref.current && !ref.current.contains(target);

      if (isOutside) {
        handler(event);
      }
    },
    [handler, ref],
  );

  useEventListener(eventType, cb, undefined, eventListenerOptions);
}

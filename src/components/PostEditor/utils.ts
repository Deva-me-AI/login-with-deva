import type { EditorState, RemirrorJSON } from "remirror";

export const editorStateToText = (state: EditorState) => {
  const json = state.doc.toJSON() as RemirrorJSON;
  const text = json.content?.reduce((acc, node, index) => {
    const nodeContent = node.content ?? [];
    const nodesText =
      nodeContent.reduce((acc, nodeJson) => {
        switch (nodeJson.type) {
          case "text":
            return acc + (nodeJson.text ?? "");
          case "mentionAtom":
            return acc + (nodeJson.attrs as { label: string }).label;
          default:
            return acc;
        }
      }, "") || "";

    return (
      acc +
      nodesText +
      (index < ((json.content?.length ?? 0) - 1 || 0) ? "\n" : "")
    );
  }, "");

  return text?.trim?.() ?? "";
};

import { useState, FormEvent } from "react";
import { useDevaContext } from "@/DevaContext";
import type { Message as IMessage } from "@/server";
import { useIntercom } from "./IntercomContext";

interface InputProps {
  threadId?: string;
  showLoading?: boolean;
  onSubmit: (message: IMessage) => Promise<void>;
}

export const Input = ({
  threadId,
  showLoading = false,
  onSubmit,
}: InputProps) => {
  const { url, accessToken, user } = useDevaContext();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { scrollToBottom } = useIntercom();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!text.trim() || !threadId || !accessToken || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${url}/api/sdk/chat/${threadId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const message = await response.json();

      // Clear input
      setText("");

      // Submit message to parent
      await onSubmit(message);

      // Scroll to bottom
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          disabled={showLoading || isSubmitting}
          className="flex-1 rounded-md border border-gray-600 bg-midnight-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim() || showLoading || isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-600"
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
};

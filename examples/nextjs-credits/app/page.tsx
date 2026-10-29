"use client";
import { useState } from "react";
import { useDevaAI } from "@deva-me/login-with-deva";
export default function Page() {
  const { chat, loading, error } = useDevaAI();
  const [model, setModel] = useState("user-default");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  return (
    <main>
      <h1>Use your Deva credits</h1>
      <a href="/api/deva/login">Log in with Deva</a>
      <p>Approve this app’s monthly limit on Deva when you log in.</p>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            const response = await chat({
              model,
              messages: [{ role: "user", content: prompt }],
            });
            setAnswer(
              `${response.model}: ${response.choices[0]?.message.content ?? ""}`,
            );
          } catch {
            /* The hook exposes the error below. */
          }
        }}
      >
        <label>
          Model{" "}
          <input
            value={model}
            onChange={(event) => setModel(event.target.value)}
            required
          />
        </label>
        <label>
          Message{" "}
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            required
            maxLength={8000}
          />
        </label>
        <button disabled={loading}>{loading ? "Thinking…" : "Send"}</button>
      </form>
      {error && <p role="alert">{error.message}</p>}
      <pre>{answer}</pre>
    </main>
  );
}

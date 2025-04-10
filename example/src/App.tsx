"use client";

import "deva-sdk/style.css";
import "./index.css";
import "./App.css";
import { type Envs } from "deva-sdk";
import { lazy, Suspense, type ReactNode } from "react";

// Dynamically import components
const DevaProvider = lazy(() =>
  import("deva-sdk").then(({ DevaProvider }) => ({ default: DevaProvider })),
);
const Content = lazy(() =>
  import("./Content").then(({ Content }) => ({ default: Content })),
);

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`card ${className}`}>{children}</div>;
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DevaProvider
        clientId={import.meta.env.VITE_DEVA_CLIENT_ID!}
        redirectUri={typeof window != "undefined" ? window.location.origin : ""}
        scopes={["read", "write"]}
        env={import.meta.env.VITE_DEVA_ENV as Envs}
      >
        <>
          <header
            style={{
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h1
              className="h1"
              style={{
                fontSize: "3.2em",
                lineHeight: "1.1",
                wordWrap: "break-word",
              }}
            >
              Deva-Sdk
            </h1>
          </header>
          <Content />
        </>
      </DevaProvider>
    </Suspense>
  );
}

export default App;

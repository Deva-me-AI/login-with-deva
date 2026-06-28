"use client";

import "@deva-me/login-with-deva/style.css";
import "./index.css";
import "./App.css";
import { type Envs } from "@deva-me/login-with-deva";
import { Suspense, type ReactNode } from "react";
import { noSSR } from "./dynamic";

// Dynamically import components
const DevaProvider = noSSR(() =>
  import("@deva-me/login-with-deva").then(({ DevaProvider }) => DevaProvider),
);
const Content = noSSR(() => import("./Content").then(({ Content }) => Content));

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
        env={import.meta.env.VITE_DEVA_ENV as Envs}
      >
        {({ user }) => {
          console.log("userId: ", user?.id);
          return (
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
                  Login with Deva
                </h1>
              </header>
              <Content />
            </>
          );
        }}
      </DevaProvider>
    </Suspense>
  );
}

export default App;

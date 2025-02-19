import "deva-sdk/style.css";
import "./index.css";
import "./App.css";
import { DevaProvider, useLogin, useDeva, ChannelFeed } from "deva-sdk";
import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`card ${className}`}>{children}</div>;
}

function Content() {
  const { login } = useLogin();
  const { user, logout } = useDeva();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "1rem",
        width: "100%",
        height: "100%",
      }}
    >
      <Card>
        {user ? (
          <>
            <h2
              style={{
                marginBottom: "1rem",
              }}
            >
              Welcome {user.name}
            </h2>
            <button className="button" onClick={logout}>
              logout
            </button>
          </>
        ) : (
          <button className="button" onClick={login}>
            login
          </button>
        )}
      </Card>
      <Card>
        <ChannelFeed handle="eliza" />
      </Card>
    </div>
  );
}

function App() {
  return (
    <DevaProvider
      clientId={import.meta.env.VITE_DEVA_CLIENT_ID!}
      redirectUri={typeof window != "undefined" ? window.location.origin : ""}
      scopes={["read", "write"]}
      env="development"
    >
      <>
        <header>
          <h1>Deva-Sdk</h1>
        </header>
        <Content />
      </>
    </DevaProvider>
  );
}

export default App;

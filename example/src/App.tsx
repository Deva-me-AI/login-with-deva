import "deva-sdk/style.css";
import "./index.css";
import "./App.css";
import { DevaProvider, useLogin, useDeva, ChannelFeed } from "deva-sdk";
import { ReactNode, useState, useEffect } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`card ${className}`}>{children}</div>;
}

type Channel = "empty" | "eliza" | "null";

function Content() {
  const { login } = useLogin();
  const { user, logout } = useDeva();

  // Get initial channel from URL or default to "empty"
  const getInitialChannel = (): Channel => {
    const params = new URLSearchParams(window.location.search);
    const channel = params.get("channel") as Channel;
    return channel && ["empty", "eliza", "null"].includes(channel)
      ? channel
      : "empty";
  };

  const [selectedChannel, setSelectedChannel] =
    useState<Channel>(getInitialChannel());

  // Update URL when channel changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("channel", selectedChannel);
    window.history.replaceState({}, "", url);
  }, [selectedChannel]);

  const handleChannelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChannel(event.target.value as Channel);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "1rem",
        width: "100%",
        marginBottom: "2rem",
      }}
    >
      <Card>
        {user ? (
          <>
            <h2
              style={{
                marginTop: ".5rem",
                marginBottom: "1rem",
              }}
            >
              Welcome
            </h2>
            <h3
              style={{
                marginBottom: "1rem",
              }}
            >
              {user?.persona?.display_name ??
                user?.persona?.username ??
                user?.preferred_username}
            </h3>
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
        <div className="channel-select-container">
          <select
            value={selectedChannel}
            onChange={handleChannelChange}
            className="channel-select"
          >
            <option value="empty">Empty Channel</option>
            <option value="eliza">Eliza</option>
            <option value="null">404</option>
          </select>
        </div>
        <ChannelFeed handle={selectedChannel} />
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
        <header
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h1>Deva-Sdk</h1>
        </header>
        <Content />
      </>
    </DevaProvider>
  );
}

export default App;

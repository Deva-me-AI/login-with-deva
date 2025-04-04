import "deva-sdk/style.css";
import "./index.css";
import "./App.css";
import { DevaProvider, useDeva, ChannelFeed, Intercom } from "deva-sdk";
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
type PersonaOption = "deva_support" | "truejaian" | "no-user";

function Content() {
  const { user, login, logout } = useDeva();

  // Get initial channel from URL or default to "empty"
  const getInitialChannel = (): Channel => {
    const params = new URLSearchParams(window.location.search);
    const channel = params.get("channel") as Channel;
    return channel && ["empty", "eliza", "null"].includes(channel)
      ? channel
      : "eliza";
  };

  const [selectedChannel, setSelectedChannel] =
    useState<Channel>(getInitialChannel());

  // Default persona is deva_support
  const [selectedPersona, setSelectedPersona] =
    useState<PersonaOption>("deva_support");

  // Update URL when channel changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("channel", selectedChannel);
    window.history.replaceState({}, "", url);
  }, [selectedChannel]);

  const handleChannelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChannel(event.target.value as Channel);
  };

  const handlePersonaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPersona(event.target.value as PersonaOption);
  };

  return (
    <>
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
                  fontSize: "2.4em",
                  lineHeight: "1.25",
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
              <option value="eliza">Eliza</option>
              <option value="empty">Empty Channel</option>
              <option value="null">404</option>
            </select>
          </div>
          <div className="content-container">
            <ChannelFeed handle={selectedChannel} />
          </div>
        </Card>
        <Card>
          {user ? (
            <div className="persona-select-container">
              <h3 style={{ marginBottom: "1rem" }}>
                Select Persona for Intercom Chat
              </h3>
              <select
                value={selectedPersona}
                onChange={handlePersonaChange}
                className="channel-select"
              >
                <option value="deva_support">Deva Support</option>
                <option value="truejaian">Mediche</option>
                <option value="no-user">No User</option>
              </select>
            </div>
          ) : (
            <div style={{ marginBottom: "1rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>
                Login to select a Deva to chat with
              </h3>
            </div>
          )}
        </Card>
      </div>
      <Intercom username={selectedPersona} />
    </>
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
  );
}

export default App;

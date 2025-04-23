"use client";

import { useDeva } from "deva-sdk";
import { ChannelFeed, Intercom } from "deva-sdk/components";
import { type ReactNode, useState, useEffect } from "react";

// Dynamically import components

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

export function Content() {
  const { isAuthenticated, accessToken, user, login, logout } = useDeva();

  // Get initial channel from URL or default to "empty"
  const getInitialChannel = (): Channel => {
    const params = new URLSearchParams(window.location.search);
    const channel = params.get("channel") as Channel;
    return channel && ["empty", "eliza", "null"].includes(channel)
      ? channel
      : "eliza";
  };

  // Get initial persona from URL or default to "deva_support"
  const getInitialPersona = (): PersonaOption => {
    const params = new URLSearchParams(window.location.search);
    const persona = params.get("persona") as PersonaOption;
    return persona && ["deva_support", "truejaian", "no-user"].includes(persona)
      ? persona
      : "deva_support";
  };

  const [selectedChannel, setSelectedChannel] =
    useState<Channel>(getInitialChannel());

  const [selectedPersona, setSelectedPersona] =
    useState<PersonaOption>(getInitialPersona());

  // Update URL when channel or persona changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("channel", selectedChannel);
    url.searchParams.set("persona", selectedPersona);
    window.history.replaceState({}, "", url);
  }, [selectedChannel, selectedPersona]);

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
          {isAuthenticated ? (
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
              <h3
                style={{
                  marginBottom: "1rem",
                }}
              >
                Access Token: 
                {accessToken ? `${accessToken.substring(0, 6)} * * * *` : "No access token found"}
              </h3>
              <div>
                Vap Votes: {user?.persona?.yap_votes ?? 0}
              </div>
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
          {isAuthenticated ? (
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

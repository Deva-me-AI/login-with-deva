import "deva-sdk/style.css";
import "./index.css";
import "./App.css";
import { DevaProvider, useLogin, useDeva, SocialFeed } from "deva-sdk";

function Content() {
  const { login } = useLogin();
  const { user, LogOut } = useDeva();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
        color: "white",
        borderRadius: "1rem",
        backgroundColor: "#333",
      }}
    >
      {user ? (
        <>
          <h2
            style={{
              marginBottom: "1rem",
              fontSize: "1rem",
            }}
          >
            Welcome {user.name}
          </h2>
          <button className="button" onClick={LogOut}>
            logout
          </button>
        </>
      ) : (
        <button className="button" onClick={login}>
          login
        </button>
      )}
      <SocialFeed />
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
      <div>
        <h1
          style={{
            textAlign: "center",
            padding: "1.5rem",
          }}
        >
          Deva-Sdk
        </h1>
        <div>
          <Content />
        </div>
      </div>
    </DevaProvider>
  );
}

export default App;

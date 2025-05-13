import { DevaProvider, type Envs } from "deva-sdk";
import { Content } from "./Content";

function App() {
  return (
    <DevaProvider
      clientId={import.meta.env.VITE_DEVA_CLIENT_ID!}
      redirectUri={typeof window != "undefined" ? window.location.origin : ""}
      scopes={["read", "write"]}
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
                Deva-Sdk
              </h1>
            </header>
            <Content />
          </>
        );
      }}
    </DevaProvider>
  );
}

export default App;

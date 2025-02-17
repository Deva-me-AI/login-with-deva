import "./App.css";
import "deva-sdk/style.css";
import { DevaProvider, useLogin, useDeva, SocialFeed } from "deva-sdk";

function Content() {
  const { login } = useLogin();
  const { user, LogOut } = useDeva();
  return (
    <div>
      {user ? (
        <>
          <h2>Welcome {user.name}</h2>
          <button onClick={LogOut}>logout</button>
        </>
      ) : (
        <button onClick={login}>login</button>
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
      <>
        <h1>Deva-Sdk</h1>
        <div className="card">
          <Content />
        </div>
      </>
    </DevaProvider>
  );
}

export default App;

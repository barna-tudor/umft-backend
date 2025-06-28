import React, { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import { registerBedside } from "./services/api";

function App() {
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    async function init() {
      const cachedKey = localStorage.getItem("apiKey");
      if (!cachedKey) {
        const newKey = await registerBedside();
        console.log(newKey);
        if (newKey) {
          localStorage.setItem("apiKey", newKey);
        } else {
          setAuthError(true);
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  if (loading) return <div className="p-10 text-xl">Initializing...</div>;
  if (authError) return <div className="p-10 text-xl text-red-400">Authorization failed.</div>;

  return <Dashboard />;
}

export default App;

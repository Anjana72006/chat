import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

import Auth from "./pages/AuthPage";
import Chat from "./pages/Chatpages";
export default function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Loading...</h2>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/chat" /> : <Auth />} />
      <Route
        path="/chat"
        element={user ? <Chat /> : <Navigate to="/" />}
      />
    </Routes>
  );
}
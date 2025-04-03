import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FlowerList from "./components/FlowerList";
import { isAuthenticated } from "./utils/auth";
import React from "react";
import Navbar from "./components/Navbar";

const App = () => {
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = () => setAuth(isAuthenticated());
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <Router>
      {auth && <Navbar setAuth={setAuth} />} {/* ✅ Pass setAuth to Navbar */}
      <Routes>
        <Route
          path="/"
          element={
            auth ? <Navigate to="/flowers" /> : <Login setAuth={setAuth} />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/flowers"
          element={auth ? <FlowerList /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;

// context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: !!localStorage.getItem("role"),
    username: localStorage.getItem("username") || "",
    role: localStorage.getItem("role") || "",
    token: localStorage.getItem("token") || "",
  });

  const login = (username, role, token) => {
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    localStorage.setItem("token", token);
    setAuth({ isAuthenticated: true, username, role, token });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ isAuthenticated: false, username: "", role: "", token: "" });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

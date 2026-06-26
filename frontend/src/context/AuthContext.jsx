import { createContext, useContext, useEffect, useState } from "react";
import { blogApi, TOKEN_KEY } from "@/lib/blogApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null); // null = loading, false = guest, obj = admin
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setAdmin(false);
      setChecked(true);
      return;
    }
    blogApi
      .me()
      .then((data) => setAdmin(data))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAdmin(false);
      })
      .finally(() => setChecked(true));
  }, []);

  const login = async (email, password) => {
    const { token, email: e } = await blogApi.login(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setAdmin({ email: e });
    return true;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ admin, checked, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

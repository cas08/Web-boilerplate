import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth має бути всередині AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authCookie = Cookies.get("auth");
      if (authCookie) {
        try {
          const userData = JSON.parse(authCookie);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing auth cookie:", error);
          Cookies.remove("auth");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (username) => {
    const userData = { username };
    setUser(userData);
    setIsAuthenticated(true);
    Cookies.set("auth", JSON.stringify(userData), { expires: 7 });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    Cookies.remove("auth");
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

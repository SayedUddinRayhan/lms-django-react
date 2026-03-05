import { createContext, useState, useEffect, useContext } from "react";
import { authService } from "./authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const initUser = async () => {
    setIsAuthLoading(true);
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        authService.logout();
        setUser(null);
      }
    }
    setIsAuthLoading(false);
  };

  useEffect(() => {
    initUser();
  }, []);

  const login = async (credentials) => {
    setAuthError(null);
    setIsAuthLoading(true);
  
    try {
      const user = await authService.login(credentials);
      setUser(user);
  
      // Redirect to generic dashboard
      navigate("/dashboard"); // <- This ensures everyone goes to /dashboard
      return user;
    } catch (err) {
      setAuthError(err.message || "Login failed");
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading,
        authError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
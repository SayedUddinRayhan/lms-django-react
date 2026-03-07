import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "./authService";

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

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access");
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
         
          redirectToDashboard(currentUser?.role);
        } catch (err) {
          authService.logout();
          setUser(null);
        }
      }
      setIsAuthLoading(false);
    };
    initAuth();
  }, []);

  const redirectToDashboard = (role) => {
    if (!role) return; 
    
    if (role === "student") {
      if (window.location.pathname === "/login") {
        navigate("/dashboard/student", { replace: true });
      }
    } else if (role === "instructor") {
      if (window.location.pathname === "/login") {
        navigate("/dashboard/instructor/courses", { replace: true });
      }
    }
   
  };

  const login = async ({ identifier, password }) => {
    setAuthError(null);
    setIsAuthLoading(true);
  
    try {
      const user = await authService.login({ identifier, password });
      setUser(user);
  
      redirectToDashboard(user?.role);
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
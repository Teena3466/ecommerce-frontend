import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);

  const decodeToken = (jwtToken) => {
    if (!jwtToken) {
      return null;
    }

    try {
      const payload = JSON.parse(
        atob(jwtToken.split(".")[1])
      );

      return {
        email: payload.sub || "",
        role: payload.role || "",
      };
    } catch (error) {
      console.error(
        "Unable to decode authentication token:",
        error
      );

      return null;
    }
  };

  useEffect(() => {
    if (token) {
      const decodedUser = decodeToken(token);
      setUser(decodedUser);
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    const decodedUser = decodeToken(newToken);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token);

  const isAdmin =
    user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
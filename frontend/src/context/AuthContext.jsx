import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [error, setError] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingAuth(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(
        "/api/auth/login",
        { username, password },
        { withCredentials: true }
      );
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      showMessage("Login successful!", "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      setError(msg);
      showMessage(msg, "error");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { headers: { Authorization: `Bearer ${user.token}` } }, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("user");
      showMessage("Logged out successfully", "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Logout failed";
      showMessage(msg, "error");
    }
  };

  const register = async (username, password) => {
    try {
      const res = await axios.post("/api/auth/register", { username, password }, { withCredentials: true });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      showMessage("Registration successful!", "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      showMessage(msg, "error");
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loadingAuth, login, logout, register, showMessage }}>
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};

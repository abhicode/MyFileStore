import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Container, Box, Typography, Button } from "@mui/material";

export default function LandingPage() {
  const { user, showMessage } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (location.state?.message) {
      showMessage(location.state.message, location.state.severity || "info");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, showMessage]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #3b82f6, #9333ea)",
        color: "white",
        textAlign: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          Welcome to MyFileStore
        </Typography>

        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "primary.main",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "primary.main",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

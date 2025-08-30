import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { FileProvider } from "./context/FileContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <FileProvider>
      <App />
    </FileProvider>
  </AuthProvider>
);
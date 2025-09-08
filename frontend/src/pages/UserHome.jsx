import React, { useContext, useRef } from "react";
import { FileContext } from "../context/FileContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
} from "@mui/material";
import { Delete, Visibility, Download, Upload } from "@mui/icons-material";
import axios from "axios";

export default function UserHome() {
  const { files, moveToTrash, loading, error, fetchFiles } = useContext(FileContext);
  const { user, logout, showMessage } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleView = async (file) => {
    try {
      const response = await axios.get(`/api/files/${file.id}/download`, {
        headers: { Authorization: `Bearer ${user?.token}` },
        responseType: "blob",
      });

      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      const fileURL = window.URL.createObjectURL(blob);

      window.open(fileURL, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(fileURL);
      }, 10000);
    } catch (err) {
      console.error("Error opening file", err);
      showMessage("Failed to open file", "error");
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const res = await axios.get(`/api/files/${fileId}/download`, {
        headers: { Authorization: `Bearer ${user?.token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showMessage(`Downloaded ${filename}`, "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Download failed";
      showMessage(msg, "error");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/api/files/upload", formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchFiles();
      showMessage(`Uploaded ${file.name}`, "success");
    } catch (err) {
      console.error("Upload failed", err);
      showMessage("Upload failed", "error");
    } finally {
      event.target.value = "";
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await moveToTrash(fileId);
      showMessage("File moved to trash", "warning");
    } catch (err) {
      console.error("Delete failed", err);
      showMessage("Delete failed", "error");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", py: 6 }}>
      <Container maxWidth="md">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h5" fontWeight="bold">
            Your Files
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={<Upload />}
              onClick={handleUploadClick}
            >
              Upload
            </Button>
            <Button variant="outlined" color="secondary" onClick={logout}>
              Logout
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate("/trash")}>
              Trash
            </Button>
          </Box>
        </Box>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading && (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        )}

        <Paper elevation={2} sx={{ p: 2 }}>
          {files.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
              No files uploaded yet.
            </Typography>
          ) : (
            <List>
              {files.map((file) => (
                <ListItem
                  key={file.id}
                  divider
                  secondaryAction={
                    <>
                      <IconButton onClick={() => handleView(file)} color="primary">
                        <Visibility />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDownload(file.id, file.filename)}
                        color="success"
                      >
                        <Download />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(file.id)} color="error">
                        <Delete />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText primary={file.filename} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

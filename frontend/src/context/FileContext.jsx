import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { Backdrop, CircularProgress } from "@mui/material";

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const { user, showMessage } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [trashFiles, setTrashFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.token) {
      fetchFiles();
    } else {
      setFiles([]);
    }
  }, [user]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/files", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFiles(res.data);
    } catch {
      showMessage("Failed to load files", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrashFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/files/trash", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTrashFiles(res.data);
    } catch {
      showMessage("Failed to load files", "error");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file) => {
    const SUPPORTED_TYPES = [
      "text/plain",
      "image/png",
      "image/jpeg",
      "application/json",
    ];
    if (!SUPPORTED_TYPES.includes(file.type)) {
      showMessage("Unsupported file type", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
      await fetchFiles();
      showMessage("File uploaded successfully", "success");
    } catch {
      showMessage("Failed to upload file", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/files/${fileId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTrashFiles((prev) => prev.filter((f) => f.id !== fileId));
      showMessage("File deleted successfully", "info");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete file";
      showMessage(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const moveToTrash = async(fileId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/files/${fileId}/trash`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setTrashFiles((prev) => [...prev, files.find((f) => f.id === fileId)]);
      showMessage("File moved to trash successfully", "info");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete file";
      showMessage(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  const restoreFile = async(fileId) => {
    setLoading(true);
    try {
      await axios.post(`/api/files/${fileId}/restore`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTrashFiles((prev) => prev.filter((f) => f.id !== fileId));
      setFiles((prev) => [...prev, trashFiles.find((f) => f.id === fileId)]);
      showMessage("File restored successfully", "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete file";
      showMessage(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FileContext.Provider value={{ files, trashFiles, loading, fetchFiles, uploadFile, deleteFile, fetchTrashFiles, moveToTrash, restoreFile }}>
      {/* Loading overlay */}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {children}
    </FileContext.Provider>
  );
};

import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileContext } from "../context/FileContext";
import { AuthContext } from "../context/AuthContext";
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
import { Delete, Restore } from "@mui/icons-material";


export default function UserTrash() {
    const { trashFiles, deleteFile, loading, error, fetchTrashFiles, restoreFile } = useContext(FileContext);
    const { user, logout, showMessage } = useContext(AuthContext);
    const navigate = useNavigate();


    useEffect(() => {
        if (user?.token) {
          fetchTrashFiles();
        }
      }, [user]);

    const handleDelete = async (fileId) => {
        try {
            await deleteFile(fileId);
            showMessage("File deleted", "warning");
        } catch (err) {
            console.error("Delete failed", err);
            showMessage("Delete failed", "error");
        }
    };

    const handleRestore = async (fileId) => {
        try {
            await restoreFile(fileId);
        } catch (err) {
            console.error("restore failed", err);
            showMessage("restore failed", "error");
        }
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", py: 6 }}>
            <Container maxWidth="md">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h5" fontWeight="bold">
                        Trash
                    </Typography>
                    <Box display="flex" gap={2}>
                        <Button variant="outlined" color="secondary" onClick={logout}>
                            Logout
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => navigate("/home")}>
                            Go Back
                        </Button>
                    </Box>
                </Box>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {loading && (
                <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress />
                </Box>
                )}

                <Paper elevation={2} sx={{ p: 2 }}>
                {trashFiles.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" align="center">
                    No files in the trash.
                    </Typography>
                ) : (
                    <List>
                    {trashFiles.map((file) => (
                        <ListItem
                        key={file.id}
                        divider
                        secondaryAction={
                            <>
                            <IconButton onClick={() => handleRestore(file.id)} color="primary">
                                <Restore />
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
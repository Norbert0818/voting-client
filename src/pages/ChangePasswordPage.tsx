import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiConfig } from "../config/ApiConfig";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import {useAuthFetch} from "../config/authFetch";

const ChangePasswordPage = () => {
    const { user } = useContext(AuthContext)!;
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();
    const token = user.token;
    const authFetch = useAuthFetch();

    const handleChangePassword = async () => {
        try {
            const response = await authFetch(`${apiConfig.getBaseUrl()}/api/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (!response.ok) {
                throw new Error("Password change failed");
            }

            alert("Password changed successfully!");
            navigate("/dashboard");
        } catch (error) {
            alert("Password change failed!");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <Paper elevation={3} sx={{ padding: 3, width: "100%", textAlign: "center" }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>Change Password</Typography>
                <TextField fullWidth label="Current Password" type="password" margin="normal" onChange={(e) => setCurrentPassword(e.target.value)} />
                <TextField fullWidth label="New Password" type="password" margin="normal" onChange={(e) => setNewPassword(e.target.value)} />
                <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={handleChangePassword}>Change Password</Button>
            </Paper>
        </Container>
    );
};

export default ChangePasswordPage;

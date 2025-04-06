import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiConfig } from "../config/ApiConfig";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";

const LoginPage = () => {
    const { login } = useContext(AuthContext)!;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch(`${apiConfig.getBaseUrl()}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: username, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            login(data.accessToken, data.refreshToken, data.userId, data.userName, data.role);
            console.log(data.token);
            navigate("/");
        } catch (error) {
            alert("Login failed!");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <Paper elevation={3} sx={{ padding: 3, width: "100%", textAlign: "center" }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>Login</Typography>
                <TextField fullWidth label="Email" margin="normal" onChange={(e) => setUsername(e.target.value)} />
                <TextField fullWidth label="Password" type="password" margin="normal" onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={handleLogin}>Login</Button>
            </Paper>
        </Container>
    );
};

export default LoginPage;

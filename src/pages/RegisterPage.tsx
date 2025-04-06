import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConfig } from "../config/ApiConfig";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await fetch(`${apiConfig.getBaseUrl()}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            alert("Registration successful! Please log in.");
            navigate("/login");
        } catch (error) {
            alert("Registration failed!");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <Paper elevation={3} sx={{ padding: 3, width: "100%", textAlign: "center" }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>Register</Typography>
                <TextField fullWidth label="Username" margin="normal" onChange={(e) => setUsername(e.target.value)} />
                <TextField fullWidth label="Email" type="email" margin="normal" onChange={(e) => setEmail(e.target.value)} />
                <TextField fullWidth label="Password" type="password" margin="normal" onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={handleRegister}>Register</Button>
            </Paper>
        </Container>
    );
};

export default RegisterPage;

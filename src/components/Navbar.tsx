import { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext)!;
    const isAuthenticated = user.isAuthenticated;
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <AppBar position="static">
            <Container>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">Voting System</Typography>
                    <div>
                        {isAuthenticated ? (
                            <>
                                <Button color="inherit" component={Link} to="/">
                                    Home
                                </Button>
                                <Button color="inherit" component={Link} to="/closed-votes">
                                    Closed Votes
                                </Button>
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>

                            </>
                        ) : (
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                        )}
                    </div>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;

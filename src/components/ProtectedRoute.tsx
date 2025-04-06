import { Navigate } from "react-router-dom";
import {JSX, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useContext(AuthContext)!;
    return user.isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

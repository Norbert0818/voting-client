import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import VotePage from "./pages/VotePage"
import ClosedVotesPage from "./pages/ClosedVotesPage";
import ClosedVoteResultPage from "./pages/ClosedVoteResultPage";
import VoteResultsPage from "./pages/VoteResultsPage";

const AppRoutes = () => {
    return (
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
                <Route path="/vote/:id" element={<ProtectedRoute><VotePage /></ProtectedRoute>} />
                <Route path="/closed-votes" element={<ProtectedRoute><ClosedVotesPage /></ProtectedRoute>} />
                <Route path="/closed-vote/:voteId" element={<ProtectedRoute><ClosedVoteResultPage /></ProtectedRoute>} />
                <Route path="/vote/:voteId/results" element={<ProtectedRoute><VoteResultsPage /></ProtectedRoute>} />

            </Routes>
    );
};

export default AppRoutes;

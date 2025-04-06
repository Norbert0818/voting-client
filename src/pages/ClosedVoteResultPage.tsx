import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Container, Typography, LinearProgress, Box } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { apiConfig } from "../config/ApiConfig";
import {useAuthFetch} from "../config/authFetch";

interface OptionResult {
    optionText: string;
    voteCount: number;
    percentage: number;
}

interface VoteResultsResponse {
    question: string;
    results: OptionResult[];
}

const ClosedVoteResultPage = () => {
    const { user } = useContext(AuthContext)!;
    const { voteId } = useParams<{ voteId: string }>();
    const [results, setResults] = useState<VoteResultsResponse | null>(null);
    const authFetch = useAuthFetch();

    useEffect(() => {
        authFetch(`${apiConfig.getBaseUrl()}/api/votes/${voteId}/results`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
            .then(res => res.json())
            .then(setResults)
            .catch((err) => {
                console.error("Error loading results:", err);
            });
    }, [voteId]);

    if (!results) return <Container sx={{ mt: 4 }}><Typography>Loading results...</Typography></Container>;

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>{results.question}</Typography>

            {results.results.map((option, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="body1">{option.optionText} ({option.voteCount} votes)</Typography>
                    <LinearProgress variant="determinate" value={option.percentage} sx={{ height: 10, borderRadius: 5 }} />
                    <Typography variant="body2" sx={{ color: "gray" }}>{option.percentage.toFixed(1)}%</Typography>
                </Box>
            ))}
        </Container>
    );
};

export default ClosedVoteResultPage;

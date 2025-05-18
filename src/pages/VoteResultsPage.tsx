import {useContext, useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, List, ListItem, LinearProgress, Box } from "@mui/material";
import { apiConfig } from "../config/ApiConfig";
import {useAuthFetch} from "../config/authFetch";
import {AuthContext} from "../context/AuthContext";
// import * as signalR from "@microsoft/signalr";


interface OptionResult {
    optionText: string;
    voteCount: number;
    percentage: number;
}

interface VoteResultsResponse {
    question: string;
    results: OptionResult[];
}

const VoteResultsPage = () => {
    const { voteId } = useParams();
    const [results, setResults] = useState<VoteResultsResponse | null>(null);
    const authFetch = useAuthFetch();
    const { user } = useContext(AuthContext)!;

    useEffect(() => {
        authFetch(`${apiConfig.getBaseUrl()}/api/votes/${voteId}/results`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
            .then(res => res.json())
            .then(data => setResults(data));
    }, [voteId]);



    if (!results) return <Container><Typography>Loading...</Typography></Container>;

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>{results.question}</Typography>
            <List>
                {results.results.map((r, idx) => (
                    <ListItem key={idx} sx={{ flexDirection: "column", alignItems: "start" }}>
                        <Typography>{r.optionText} – {r.voteCount} vote(s) ({r.percentage.toFixed(1)}%)</Typography>
                        <Box sx={{ width: "100%", mt: 1 }}>
                            <LinearProgress variant="determinate" value={r.percentage} />
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default VoteResultsPage;
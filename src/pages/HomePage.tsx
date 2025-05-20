import { useEffect, useState, useContext } from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    Container, Typography, Card, CardContent, Grid, Box, Button
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { apiConfig } from "../config/ApiConfig";
import {useAuthFetch} from "../config/authFetch";

interface VoteOption {
    id: number;
    optionText: string;
}

interface Vote {
    id: number;
    question: string;
    options: VoteOption[];
    startTime: string;
    endTime: string;
}

const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};

const HomePage = () => {
    const { user } = useContext(AuthContext)!;
    const isAuthenticated = user.isAuthenticated;
    const navigate = useNavigate();
    const [votes, setVotes] = useState<Vote[]>([]);
    const [userVotes, setUserVotes] = useState<{ [voteId: number]: VoteOption[] }>({});

    const authFetch = useAuthFetch();

    useEffect(() => {
        if (isAuthenticated) {
            authFetch(`${apiConfig.getBaseUrl()}/api/votes/assigned`)
                .then(res => res.json())
                .then((data) => {
                    const now = new Date();
                    const activeVotes = data
                        .filter((vote: Vote) => new Date(vote.endTime) > now)
                        .sort((a: Vote, b: Vote) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
                    setVotes(activeVotes);
                    // setVotes(data);
                });

            authFetch(`${apiConfig.getBaseUrl()}/api/votes/my-votes`)
                .then(async res => {
                    if (!res.ok) {
                        throw new Error(`Failed to fetch user votes: ${res.status}`);
                    }
                    return await res.json();
                })
                .then((data) => {
                    const voteMap: { [voteId: number]: VoteOption[] } = {};
                    data.forEach((v: any) => {
                        voteMap[v.voteId] = v.selectedOptions.map((o: any) => ({
                            id: o.id,
                            optionText: o.text
                        }));
                    });
                    setUserVotes(voteMap);
                });
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h3" gutterBottom>Welcome to the Voting System</Typography>
                <Typography variant="body1" gutterBottom>
                    Please login or register to view and participate in votes.
                </Typography>
                <Box mt={2}>
                    <Button variant="contained" color="primary" component={Link} to="/login" sx={{ mr: 2 }}>
                        Login
                    </Button>
                    <Button variant="outlined" color="primary" component={Link} to="/register">
                        Register
                    </Button>
                </Box>
            </Container>
        );
    }
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Active Votes</Typography>
            <Grid container spacing={3}>
                {votes.map((vote) => {
                    const hasVoted = !!userVotes[vote.id];

                    return (
                        <Grid item xs={12} sm={6} md={4} key={vote.id}>
                            <Card
                                sx={{
                                    cursor: "pointer",
                                    border: hasVoted ? "2px solid green" : "1px solid lightgray",
                                    opacity: hasVoted ? 0.85 : 1,
                                    backgroundColor: hasVoted ? "#f0fff0" : "white",
                                    transition: "0.2s",
                                    "&:hover": { boxShadow: 3 }
                                }}
                                onClick={() => navigate(`/vote/${vote.id}`)}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{vote.question}</Typography>
                                    <Typography variant="body2" sx={{ color: "gray" }}>
                                        Start: {formatDateTime(vote.startTime)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "gray" }}>
                                        End: {formatDateTime(vote.endTime)}
                                    </Typography>
                                    {Array.isArray(userVotes[vote.id]) && userVotes[vote.id].length > 0 && (
                                        <Box mt={2}>
                                            <Typography variant="body2" color="success.main">
                                                ✅ Already voted: <strong>{userVotes[vote.id].map(o => o.optionText).join(", ")}</strong>
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
};

export default HomePage;

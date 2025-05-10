// import { useEffect, useState, useContext } from "react";
// import {
//     Container, TextField, Typography, Grid, Card, CardContent, Button
// } from "@mui/material";
// import { AuthContext } from "../context/AuthContext";
// import { apiConfig } from "../config/ApiConfig";
// import { useNavigate } from "react-router-dom";
// import {useAuthFetch} from "../config/authFetch";
//
//
// interface VoteOption {
//     id: number;
//     optionText: string;
// }
//
// interface Vote {
//     id: number;
//     question: string;
//     startTime: string;
//     endTime: string;
//     options: VoteOption[];
// }
//
//
//
// const ClosedVotesPage = () => {
//     const { user } = useContext(AuthContext)!;
//     const [allVotes, setAllVotes] = useState<Vote[]>([]);
//     const [filteredVotes, setFilteredVotes] = useState<Vote[]>([]);
//     const [search, setSearch] = useState("");
//     const [fromDate, setFromDate] = useState("");
//     const [toDate, setToDate] = useState("");
//
//     const navigate = useNavigate();
//     const authFetch = useAuthFetch();
//
//     useEffect(() => {
//         // const url = new URL(`${apiConfig.getBaseUrl()}/api/votes/closed`);
//         const url = new URL(`${apiConfig.getBaseUrl()}/api/votes/closed-assigned`);
//
//         if (search) url.searchParams.append("query", search);
//         if (fromDate) url.searchParams.append("from", fromDate);
//         if (toDate) url.searchParams.append("to", toDate);
//
//         authFetch(url.toString(), {
//             headers: {
//                 Authorization: `Bearer ${user.token}`
//             }
//         })
//             .then(async res => {
//                 if (!res.ok) {
//                     const errorText = await res.text();
//                     console.error("Failed to fetch closed votes:", res.status, errorText);
//                     return [];
//                 }
//                 return res.json();
//             })
//             .then(data => {
//                 setFilteredVotes(data);
//             })
//             .catch(err => {
//                 console.error("Fetch error:", err);
//                 setFilteredVotes([]);
//             });
//     }, [search, fromDate, toDate]);
//
//
//     return (
//         <Container maxWidth="md" sx={{ mt: 4 }}>
//             <Typography variant="h4" gutterBottom>Closed Votes</Typography>
//
//             <Grid container spacing={2} sx={{ mb: 4 }} alignItems="center">
//                 <Grid item xs={12} sm={5}>
//                     <TextField
//                         label="Search by question"
//                         fullWidth
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                 </Grid>
//
//                 <Grid item xs={6} sm={3}>
//                     <TextField
//                         label="From (end date)"
//                         type="date"
//                         fullWidth
//                         slotProps={{ inputLabel: { shrink: true } }}
//                         value={fromDate}
//                         onChange={(e) => setFromDate(e.target.value)}
//                     />
//                 </Grid>
//
//                 <Grid item xs={6} sm={3}>
//                     <TextField
//                         label="To (end date)"
//                         type="date"
//                         fullWidth
//                         slotProps={{ inputLabel: { shrink: true } }}
//                         value={toDate}
//                         onChange={(e) => setToDate(e.target.value)}
//                     />
//                 </Grid>
//
//                 <Grid item xs={6} sm={1}>
//                     <Button
//                         fullWidth
//                         variant="outlined"
//                         color="error"
//                         onClick={() => {
//                             setSearch("");
//                             setFromDate("");
//                             setToDate("");
//                         }}
//                     >
//                         Clear
//                     </Button>
//                 </Grid>
//             </Grid>
//
//
//             <Grid container spacing={3}>
//                 {filteredVotes.map((vote) => (
//                     <Grid item xs={12} sm={6} md={4} key={vote.id}>
//                         <Card sx={{ "&:hover": { boxShadow: 6 } }}>
//                             <CardContent>
//                                 <Typography variant="h6">{vote.question}</Typography>
//                                 <Typography variant="body2" sx={{ color: "gray" }}>
//                                     Start: {new Date(vote.startTime).toLocaleString()}
//                                 </Typography>
//                                 <Typography variant="body2" sx={{ color: "gray" }}>
//                                     End: {new Date(vote.endTime).toLocaleString()}
//                                 </Typography>
//
//                                 <Button
//                                     fullWidth
//                                     variant="outlined"
//                                     sx={{ mt: 2 }}
//                                     onClick={() => navigate(`/vote/${vote.id}/results`)}
//                                 >
//                                     Show Results
//                                 </Button>
//                             </CardContent>
//                         </Card>
//
//                     </Grid>
//                 ))}
//             </Grid>
//         </Container>
//     );
// };
//
// export default ClosedVotesPage;


import { useEffect, useState, useContext } from "react";
import {
    Container, TextField, Typography, Grid, Card, CardContent, Button
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { apiConfig } from "../config/ApiConfig";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../config/authFetch";

interface VoteOption {
    id: number;
    optionText: string;
}

interface Vote {
    id: number;
    question: string;
    startTime: string;
    endTime: string;
    options: VoteOption[];
}

const ClosedVotesPage = () => {
    const { user } = useContext(AuthContext)!;
    const [allVotes, setAllVotes] = useState<Vote[]>([]);
    const [filteredVotes, setFilteredVotes] = useState<Vote[]>([]);
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const navigate = useNavigate();
    const authFetch = useAuthFetch();

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                const response = await authFetch(`${apiConfig.getBaseUrl()}/api/votes/closed-assigned`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Failed to fetch closed votes:", response.status, errorText);
                    setAllVotes([]);
                    return;
                }
                const data = await response.json();
                setAllVotes(data);
            } catch (err) {
                console.error("Fetch error:", err);
                setAllVotes([]);
            }
        };
        fetchVotes();
    }, [user.token]);

    useEffect(() => {
        const filtered = allVotes.filter(vote => {
            const matchesSearch = vote.question.toLowerCase().includes(search.toLowerCase());
            const voteEndDate = vote.endTime.split("T")[0];
            const matchesFrom = !fromDate || voteEndDate >= fromDate;
            const matchesTo = !toDate || voteEndDate <= toDate;
            return matchesSearch && matchesFrom && matchesTo;
        });
        setFilteredVotes(filtered);
    }, [search, fromDate, toDate, allVotes]);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Closed Votes</Typography>

            <Grid container spacing={2} sx={{ mb: 4 }} alignItems="center">
                <Grid item xs={12} sm={5}>
                    <TextField
                        label="Search by question"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Grid>

                <Grid item xs={6} sm={3}>
                    <TextField
                        label="From (end date)"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </Grid>

                <Grid item xs={6} sm={3}>
                    <TextField
                        label="To (end date)"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </Grid>

                <Grid item xs={6} sm={1}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            setSearch("");
                            setFromDate("");
                            setToDate("");
                        }}
                    >
                        Clear
                    </Button>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {filteredVotes.map((vote) => (
                    <Grid item xs={12} sm={6} md={4} key={vote.id}>
                        <Card sx={{ "&:hover": { boxShadow: 6 } }}>
                            <CardContent>
                                <Typography variant="h6">{vote.question}</Typography>
                                <Typography variant="body2" sx={{ color: "gray" }}>
                                    Start: {new Date(vote.startTime).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "gray" }}>
                                    End: {new Date(vote.endTime).toLocaleString()}
                                </Typography>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 2 }}
                                    onClick={() => navigate(`/vote/${vote.id}/results`)}
                                >
                                    Show Results
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ClosedVotesPage;
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container, Typography, Button, Card, CardContent,
    FormControl, RadioGroup, FormControlLabel, Radio, Checkbox
} from "@mui/material";
import { apiConfig } from "../config/ApiConfig";
import { AuthContext } from "../context/AuthContext";
import {useAuthFetch} from "../config/authFetch";
// import * as signalR from "@microsoft/signalr";


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
    minSelectableOptions: number;
    maxSelectableOptions: number;
}

const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};

const VotePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)!;

    const [vote, setVote] = useState<Vote | null>(null);
    const [userVotedOptions, setUserVotedOptions] = useState<VoteOption[]>([]);
    const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([]);
    const authFetch = useAuthFetch();

    const fetchVote = async () => {
        const response = await authFetch(`${apiConfig.getBaseUrl()}/api/votes/assigned`, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();
        const found = data.find((v: Vote) => v.id === Number(id));
        if (!found) {
            navigate("/");
            return;
        }
        setVote(found);
    };

    const fetchUserVotes = async () => {
        const response = await authFetch(`${apiConfig.getBaseUrl()}/api/votes/my-votes`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        const data = await response.json();
        const voteData = data.find((v: any) => v.voteId === Number(id));
        if (voteData?.selectedOptions && Array.isArray(voteData.selectedOptions)) {
            const options: VoteOption[] = voteData.selectedOptions.map((opt: any) => ({
                id: opt.id,
                optionText: opt.text,
            }));
            setUserVotedOptions(options);
        }
    };

    useEffect(() => {
        fetchVote();
        fetchUserVotes();
    }, [id]);

    // useEffect(() => {
    //     if (!vote?.id) return;
    //
    //     const connection = new signalR.HubConnectionBuilder()
    //         .withUrl(`${apiConfig.getBaseUrl()}/hubs/vote`)
    //         .withAutomaticReconnect()
    //         .build();
    //
    //     connection.start().then(() => {
    //         connection.on("ReceiveVoteUpdate", (updatedVoteId: number) => {
    //             if (updatedVoteId === vote.id) {
    //                 fetchVote();
    //             }
    //         });
    //     });
    //
    //     return () => {
    //         connection.stop();
    //     };
    // }, [vote?.id]);



    const handleVoteSubmit = async () => {

        if (
            selectedOptionIds.length < vote!.minSelectableOptions ||
            selectedOptionIds.length > vote!.maxSelectableOptions
        ) {
            alert(`You must select between ${vote!.minSelectableOptions} and ${vote!.maxSelectableOptions} option(s).`);
            return;
        }

        const response = await fetch(`${apiConfig.getBaseUrl()}/api/votes/vote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                userId: user.id,
                voteId: Number(id),
                selectedOptionIds: selectedOptionIds
            }),
        });
        if (response.ok) {
            alert("Vote submitted successfully!");
            const votedOptions = vote!.options.filter(opt => selectedOptionIds.includes(opt.id));
            setUserVotedOptions(votedOptions);
            navigate("/");
        } else {
            alert("Vote submission failed.");
        }
    };

    if (!vote) return null;


    const now = new Date();
    const voteStart = new Date(vote.startTime);
    const voteNotStarted = now < voteStart;

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>{vote.question}</Typography>
                    <Typography variant="body2" sx={{ color: "gray" }}>
                        Start: {formatDateTime(vote.startTime)} | End: {formatDateTime(vote.endTime)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
                        Select between {vote.minSelectableOptions} and {vote.maxSelectableOptions} option(s)
                    </Typography>

                    {/*{userVotedOptions.length > 0 ? (*/}
                    {/*    <Typography variant="body1" color="primary" sx={{ mt: 3 }}>*/}
                    {/*        You already voted: <strong>{userVotedOptions.map(o => o.optionText).join(", ")}</strong>*/}
                    {/*    </Typography>*/}
                    {/*) : (*/}
                    {/*    <>*/}
                    {/*        <FormControl component="fieldset" sx={{ mt: 3 }}>*/}
                    {/*            {vote.options.map((option) => (*/}
                    {/*                <FormControlLabel*/}
                    {/*                    key={option.id}*/}
                    {/*                    control={*/}
                    {/*                        <Checkbox*/}
                    {/*                            checked={selectedOptionIds.includes(option.id)}*/}
                    {/*                            onChange={() => {*/}
                    {/*                                setSelectedOptionIds(prev =>*/}
                    {/*                                    prev.includes(option.id)*/}
                    {/*                                        ? prev.filter(id => id !== option.id)*/}
                    {/*                                        : [...prev, option.id]*/}
                    {/*                                );*/}
                    {/*                            }}*/}
                    {/*                        />*/}
                    {/*                    }*/}
                    {/*                    label={option.optionText}*/}
                    {/*                />*/}
                    {/*            ))}*/}
                    {/*        </FormControl>*/}
                    {/*        <Button*/}
                    {/*            variant="contained"*/}
                    {/*            color="primary"*/}
                    {/*            fullWidth*/}
                    {/*            sx={{ mt: 3 }}*/}
                    {/*            onClick={handleVoteSubmit}*/}
                    {/*        >*/}
                    {/*            Submit Vote*/}
                    {/*        </Button>*/}
                    {/*    </>*/}
                    {/*)}*/}

                    {voteNotStarted ? (
                        <Typography variant="body1" color="warning.main" sx={{ mt: 3 }}>
                            ⚠️ Voting has not started yet. Please come back at {formatDateTime(vote.startTime)}.
                        </Typography>
                    ) : userVotedOptions.length > 0 ? (
                        <Typography variant="body1" color="primary" sx={{ mt: 3 }}>
                            You already voted: <strong>{userVotedOptions.map(o => o.optionText).join(", ")}</strong>
                        </Typography>
                    ) : (
                        <>
                            <FormControl component="fieldset" sx={{ mt: 3 }}>
                                {vote.options.map((option) => (
                                    <FormControlLabel
                                        key={option.id}
                                        control={
                                            <Checkbox
                                                checked={selectedOptionIds.includes(option.id)}
                                                onChange={() => {
                                                    setSelectedOptionIds(prev =>
                                                        prev.includes(option.id)
                                                            ? prev.filter(id => id !== option.id)
                                                            : [...prev, option.id]
                                                    );
                                                }}
                                            />
                                        }
                                        label={option.optionText}
                                    />
                                ))}
                            </FormControl>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 3 }}
                                onClick={handleVoteSubmit}
                            >
                                Submit Vote
                            </Button>
                        </>
                    )}

                </CardContent>
            </Card>
        </Container>
    );
};

export default VotePage;

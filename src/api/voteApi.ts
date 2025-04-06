import {apiConfig} from "../config/ApiConfig";

export const getActiveVotes = async () => {
    const response = await fetch(`${apiConfig.getBaseUrl()}/api/votes/active`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch active votes");
    }

    return response.json();
};

export const createVote = async (token: string, voteData: any) => {
    const response = await fetch(`${apiConfig.getBaseUrl()}/api/votes/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(voteData),
    });

    if (!response.ok) {
        throw new Error("Failed to create vote");
    }

    return response.json();
};

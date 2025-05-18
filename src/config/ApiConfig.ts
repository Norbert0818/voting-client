class ApiConfig {
    private baseURL: string;
    private hubURL: string;

    constructor() {
        this.baseURL = "https://localhost:7013";
        this.hubURL = "https://localhost:7014";
    }

    getBaseUrl(): string {
        return this.baseURL;
    }
    gethubURL(): string {
        return this.hubURL;
    }
}

export const apiConfig = new ApiConfig();

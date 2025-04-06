class ApiConfig {
    private baseURL: string;

    constructor() {
        this.baseURL = "https://localhost:7013";
    }

    getBaseUrl(): string {
        return this.baseURL;
    }
}

export const apiConfig = new ApiConfig();

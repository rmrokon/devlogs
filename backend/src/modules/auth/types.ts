export interface IGithubUser {
    id: number;
    login: string;
    avatar_url: string;
    name: string;
    email: string | null;
}

export interface IAuthResponse {
    token: string;
    user: {
        id: number;
        username: string;
        github_id: string;
    };
}

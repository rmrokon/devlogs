export interface IUser {
    id?: number;
    github_id: string;
    username: string;
    access_token?: string | null;
    created_at?: Date;
    updated_at?: Date;
}

export interface ICreateUserDTO {
    github_id: string;
    username: string;
    access_token?: string;
}

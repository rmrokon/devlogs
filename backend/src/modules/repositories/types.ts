export interface IGithubRepository {
    id?: number;
    user_id: number;
    name: string;
    url: string;
    stars: number;
    language?: string | null;
    created_at?: Date;
    updated_at?: Date;
}

export interface ICreateRepositoryDTO {
    user_id: number;
    name: string;
    url: string;
    stars?: number;
    language?: string;
}

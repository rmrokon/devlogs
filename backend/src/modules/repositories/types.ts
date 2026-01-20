export interface IGithubRepository {
    id?: number;
    user_id: number;
    name: string;
    url: string;
    stars: number;
    language?: string | null;
    languages?: Array<{ language: string, bytes: number }> | null; // JSONB
    created_at?: Date;
    updated_at?: Date;
}

export interface ICreateRepositoryDTO {
    user_id: number;
    name: string;
    url: string;
    stars?: number;
    language?: string;
    languages?: Array<{ language: string, bytes: number }>;
}

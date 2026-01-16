export interface IActivity {
    id?: number;
    repo_id: number;
    type: string;
    date: Date;
    count: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface ICreateActivityDTO {
    repo_id: number;
    type: string;
    date: Date;
    count?: number;
}

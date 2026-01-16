import { z } from "zod";

export const createRepositorySchema = z.object({
    user_id: z.number().min(1, "User ID is required"),
    name: z.string().min(1, "Repository name is required"),
    url: z.string().url("Invalid URL"),
    stars: z.number().int().nonnegative().optional(),
    language: z.string().optional(),
});

export type CreateRepositoryInput = z.infer<typeof createRepositorySchema>;

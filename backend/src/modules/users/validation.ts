import { z } from "zod";

export const createUserSchema = z.object({
    github_id: z.string().min(1, "Github ID is required"),
    username: z.string().min(1, "Username is required"),
    access_token: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

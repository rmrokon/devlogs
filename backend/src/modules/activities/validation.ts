import { z } from "zod";

export const createActivitySchema = z.object({
    repo_id: z.number().min(1, "Repository ID is required"),
    type: z.string().min(1, "Activity type is required"),
    date: z.coerce.date(),
    count: z.number().int().nonnegative().default(1),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;

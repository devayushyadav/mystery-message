import z from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message must be of 10 characters")
    .max(300, "Message content cannot exceed 300 characters"),
});

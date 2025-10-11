import z from "zod";

export const userNameValdiation = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(20, "Username must be at most 20 characters long")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  )
  .trim();

export const signUpSchema = z.object({
  username: userNameValdiation,
  email: z.string().email("Invalid email address").trim(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

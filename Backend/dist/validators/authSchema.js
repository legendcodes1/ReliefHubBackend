import { z } from "zod";
const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;
export const signupSchema = z.object({
    username: z
        .string()
        .trim()
        .toLowerCase()
        .regex(USERNAME_REGEX, "Username must be 3-30 characters and contain only lowercase letters, numbers, or underscores"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

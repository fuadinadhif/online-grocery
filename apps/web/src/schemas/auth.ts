import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please input your email")
    .email({ message: "Invalid email address" }),
  password: z.string().trim().min(1, "Please input your password"),
});

export const RegisterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please input your email")
    .email({ message: "Invalid email address" }),
});

export const CompleteRegistrationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must containt at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at leas one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/\W/, "Password must containe at least one special character"),
  confirmPassword: z.string(),
});

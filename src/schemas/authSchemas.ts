import { z } from "zod";

// Base schema for common fields across multiple forms
export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Authentication schemas
export const loginSchema = emailSchema.merge(passwordSchema);

export const signupSchema = loginSchema.extend({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
});

// User profile schemas
export const updateProfileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address").optional(),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Form value types
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

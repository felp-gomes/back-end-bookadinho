import z from 'zod';

export const PostValidation = z.object({
  id: z.string().uuid().readonly(),
  text: z.string().trim().max(600, { message: 'Must be a maximum of 600 characters' }),
  user_id: z.string().uuid().readonly(),
});

export const PostValidationUpdated = z.object({
  id: z.string().uuid().readonly(),
  text: z.string().trim().max(600, { message: 'Must be a maximum of 600 characters' }).optional(),
  user_id: z.string().uuid().readonly(),
});

export type UserType = z.infer<typeof PostValidation>;

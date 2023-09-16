import z from 'zod';

export const UserValidation = z.object({
  id: z.string().uuid().readonly(),
  user_name: z
    .string()
    .trim()
    .min(4, { message: 'Must be at least 4 characters long' })
    .max(25, { message: 'Must be a maximum of 25 characters' }),
  name: z
    .string()
    .trim()
    .min(4, { message: 'Must be at least 4 characters long' })
    .max(45, { message: 'Must be a maximum of 45 characters' }),
  email: z.string().trim().email().min(4, { message: 'Must be at least 4 characters long' }),
  password: z.string().trim().max(64, { message: 'It must be a maximum of 64 characters because it is a password' }),
  description: z.string().trim().max(255, { message: 'Must be a maximum of 255 characters' }).nullable(),
  likes: z.string().array().max(125, { message: 'Must be a maximum of 255 characters' }),
  latest_readings: z.string().array().max(125, { message: 'Must be a maximum of 255 characters' }),
  photo: z.string().trim().url().nullable(),
  is_activated: z.boolean(),
});

export type UserType = z.infer<typeof UserValidation>;

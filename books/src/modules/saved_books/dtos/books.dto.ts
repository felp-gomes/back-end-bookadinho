import z from 'zod';

export const BookValidation = z.object({
  id: z.string().uuid().readonly(),
  name: z
    .string()
    .trim()
    .min(4, { message: 'Must be at least 4 characters long' })
    .max(45, { message: 'Must be a maximum of 45 characters' }),
  author: z
    .string()
    .trim()
    .min(4, { message: 'Must be at least 4 characters long' })
    .max(45, { message: 'Must be a maximum of 45 characters' }),
  description: z.string().trim().max(255, { message: 'Must be a maximum of 255 characters' }),
  photo: z.string().trim().url().optional(),
  rate: z.string().max(1, { message: 'The number must be between 1 and 5' }).nullable(),
  owner_id: z.string().uuid().readonly(),
});

export type UserType = z.infer<typeof BookValidation>;

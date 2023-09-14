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
  description: z
    .string()
    .trim()
    .min(4, { message: 'Must be at least 4 characters long' })
    .max(255, { message: 'Must be a maximum of 255 characters' }),
  photo: z.string().trim().url().nullable(),
  is_changed: z.boolean(),
  is_read: z.boolean(),
  is_deleted: z.boolean(),
  user_id: z.string().uuid().readonly(),
});

export type BookType = z.infer<typeof BookValidation>;

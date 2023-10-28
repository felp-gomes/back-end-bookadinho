import z from 'zod';

export const BookValidation = z.object({
  id: z.string().uuid().readonly(),
  name: z
    .string()
    .trim()
    .min(4, { message: 'Must be at least 4 characters long' })
    .max(255, { message: 'Must be a maximum of 255 characters' }),
  author: z
    .string()
    .trim()
    .min(4, { message: 'Must be at least 4 characters long' })
    .max(45, { message: 'Must be a maximum of 45 characters' }),
  description: z.string().trim().max(255, { message: 'Must be a maximum of 255 characters' }),
  photo: z.string().trim().url().optional(),
  is_changed: z.boolean(),
  is_read: z.boolean(),
  is_deleted: z.boolean(),
  rate: z.string().max(1, { message: 'The number must be between 1 and 5' }).nullable(),
  owner_id: z.string().uuid().readonly(),
});

export const BookValidationUpdated = z.object({
  id: z.string().uuid().readonly(),
  name: z
    .string()
    .trim()
    .min(4, { message: 'Must be at least 4 characters long' })
    .max(255, { message: 'Must be a maximum of 255 characters' })
    .optional(),
  author: z
    .string()
    .trim()
    .min(4, { message: 'Must be at least 4 characters long' })
    .max(45, { message: 'Must be a maximum of 45 characters' })
    .optional(),
  description: z.string().trim().max(255, { message: 'Must be a maximum of 255 characters' }).optional(),
  photo: z.string().trim().url().optional(),
  is_changed: z.boolean().optional(),
  is_read: z.boolean().optional(),
  is_deleted: z.boolean().optional(),
  rate: z.string().max(1, { message: 'The number must be between 1 and 5' }).nullable(),
  owner_id: z.string().uuid().readonly().optional(),
});

export type UserType = z.infer<typeof BookValidation>;

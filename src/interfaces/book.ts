import z from 'zod';

export interface BookInterface {
  readonly id: string;
  name: string;
  author: string;
  description: string;
  photo: string | null;
  is_changed: boolean;
  is_read: boolean;
  is_deleted: boolean;
  readonly user_id: string;
}

export const BookValidation = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .trim()
    .min(4, { message: 'must be at least 4 characters long' })
    .max(45, { message: 'Must be a maximum of 45 characters' }),
  author: z
    .string()
    .trim()
    .min(4, { message: 'must be at least 4 characters long' })
    .max(45, { message: 'Must be a maximum of 45 characters' }),
  description: z
    .string()
    .trim()
    .min(4, { message: 'must be at least 4 characters long' })
    .max(45, { message: 'Must be a maximum of 45 characters' }),
  photo: z.string().trim().url(),
  is_changed: z.boolean(),
  is_read: z.boolean(),
  is_deleted: z.boolean(),
  user_id: z.string().uuid(),
});

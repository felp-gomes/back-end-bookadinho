import z from 'zod';

export const BookValidation = z.object({
  book_id: z.string().uuid().readonly(),
  owner_id: z.string().uuid().readonly(),
});

export type UserType = z.infer<typeof BookValidation>;

import z from 'zod';

export const ChatValidation = z.object({
  id: z.string().uuid().readonly(),
  sender_id: z.string().uuid().readonly(),
  receiver_id: z.string().uuid().readonly(),
  status: z.string().default('pending'),
});

export const ChatCreate = z.object({
  sender_id: z.string().uuid().readonly(),
  receiver_id: z.string().uuid().readonly(),
  status: z.string().default('pending'),
});

export const chatStatusUpdate = z.object({
  status: z.string(),
});

export type ChatType = z.infer<typeof ChatCreate>;

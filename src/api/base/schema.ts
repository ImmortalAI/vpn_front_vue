import z from 'zod';

export const MessageRsSchema = z.object({
  message: z.string(),
});

export type MessageRs = z.infer<typeof MessageRsSchema>;

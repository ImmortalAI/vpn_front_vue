// #region imports
import * as z from 'zod';
// #endregion

export const MessageRsSchema = z.object({
  message: z.string(),
});

export type MessageRs = z.infer<typeof MessageRsSchema>;

export const ErrorRsSchema = z.object({
  detail: z.string(),
});

export type ErrorRs = z.infer<typeof ErrorRsSchema>;

export const UuidSchema = z.uuid();

export type Uuid = z.infer<typeof UuidSchema>;

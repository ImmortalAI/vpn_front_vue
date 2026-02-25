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

export const PaginationSchema = z.object({
  offset: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

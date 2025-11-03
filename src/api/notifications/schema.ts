// #region imports
import * as z from 'zod';
import { type MessageRs, MessageRsSchema } from '@/api/base/schema';
// #endregion

export const LanguageCodeSchema = z.enum(['en', 'ru']);

export type LanguageCode = z.infer<typeof LanguageCodeSchema>;

export const NotificationSchema = z.object({
  data: z.record(LanguageCodeSchema, z.string()),
});

export type Notification = z.infer<typeof NotificationSchema>;

// request post /notifications
export { NotificationSchema as NotificationPostRqSchema, type Notification as NotificationPostRq };

// response post /notifications
export { MessageRsSchema as NotificationPostRsSchema, type MessageRs as NotificationPostRs };

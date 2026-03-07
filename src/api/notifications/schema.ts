// #region imports
import * as z from 'zod';
// #endregion

export const LanguageCodeSchema = z.enum(['en', 'ru']);

export type LanguageCode = z.infer<typeof LanguageCodeSchema>;

export const NotificationSchema = z.object({
  data: z.record(LanguageCodeSchema, z.string()),
  notify: z.boolean(),
});

export type Notification = z.infer<typeof NotificationSchema>;

import { z } from 'zod';
import { type MessageRs, MessageRsSchema } from '@/api/base/schema';
import { TariffSchema } from '@/api/tariff/schema';

export const RightsSchema = z.object({
  is_server_editor: z.boolean(),
  is_transaction_editor: z.boolean(),
  is_active_period_editor: z.boolean(),
  is_tariff_editor: z.boolean(),
  is_member_rights_editor: z.boolean(),
  is_admin_rights_editor: z.boolean(),
  is_control_panel_user: z.boolean(),
  is_verified: z.boolean(),
});

export const SettingsSchema = z.object({
  auto_pay: z.boolean(),
  is_active: z.boolean(),
  get_traffic_notifications: z.boolean(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  telegram_id: z.number().int(),
  telegram_username: z.string(),
  balance: z.number(),
  created_date: z.string().datetime({ local: true }),
  rights: RightsSchema,
  settings: SettingsSchema,
  tariff: TariffSchema,
});

export type UserRights = z.infer<typeof RightsSchema>;
export type UserSettings = z.infer<typeof SettingsSchema>;
export type User = z.infer<typeof UserSchema>;

// response get /user
export { UserSchema as UserGetRsSchema, type User as UserGetRs };

// request patch /user/{user_id}
export const UserPatchRqSchema = z.object({
  telegram_id: z.number().int().optional(),
  tariff_id: z.string().uuid().optional(),
  rights: RightsSchema.optional(),
  settings: SettingsSchema.optional(),
});

export type UserPatchRq = z.infer<typeof UserPatchRqSchema>;

export { MessageRsSchema as UserPatchRsSchema, type MessageRs as UserPatchRs };

// response get /user/all
export const UserAllGetRsSchema = z.array(UserSchema);

export type UserAllGetRs = z.infer<typeof UserAllGetRsSchema>;

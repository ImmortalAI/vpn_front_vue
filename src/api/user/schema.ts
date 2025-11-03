// #region imports
import * as z from 'zod';
import { type MessageRs, MessageRsSchema } from '@/api/base/schema';
import { TariffSchema } from '@/api/tariff/schema';
// #endregion

export const UserRightsSchema = z.object({
  is_server_editor: z.boolean(),
  is_user_editor: z.boolean(),
  is_transaction_editor: z.boolean(),
  is_active_period_editor: z.boolean(),
  is_tariff_editor: z.boolean(),
  is_member_rights_editor: z.boolean(),
  is_admin_rights_editor: z.boolean(),
  is_control_panel_user: z.boolean(),
  is_verified: z.boolean(),
});

export const UserSettingsSchema = z.object({
  auto_pay: z.boolean(),
  is_active: z.boolean(),
  get_traffic_notifications: z.boolean(),
});

export const UserSchema = z.object({
  id: z.uuid(),
  telegram_id: z.number().int(),
  telegram_username: z.string(),
  telegram_language_code: z.string(),
  description: z.string(),
  balance: z.number(),
  created_date: z.coerce.date(),
  rights: UserRightsSchema,
  settings: UserSettingsSchema,
  tariff: TariffSchema,
});

export type UserRights = z.infer<typeof UserRightsSchema>;
export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type User = z.infer<typeof UserSchema>;

// request get /users
export const UserGetRqSchema = z.object({
  offset: z.number().int().optional(),
  limit: z.number().int().optional(),
});

export type UserGetRq = z.infer<typeof UserGetRqSchema>;

// response get /users
export const UserGetRsSchema = z.array(UserSchema);

export type UserGetRs = z.infer<typeof UserGetRsSchema>;

// response get /users/count

export const UserCountRsSchema = z.number().int();

export type UserCountRs = z.infer<typeof UserCountRsSchema>;

// request patch /users/{user_id}
export const UserPatchRqSchema = z.object({
  telegram_id: z.number().int().optional(),
  tariff_id: z.uuid().optional(),
  description: z.string().optional(),
  rights: UserRightsSchema.optional(),
  settings: UserSettingsSchema.optional(),
});

export type UserPatchRq = z.infer<typeof UserPatchRqSchema>;

// response patch /users/{user_id}
export { MessageRsSchema as UserPatchRsSchema, type MessageRs as UserPatchRs };

// request /users/{user_id}
export const UserGetByIdRqSchema = z.object({
  user_id: z.uuid(),
});

export type UserGetByIdRq = z.infer<typeof UserGetByIdRqSchema>;

// response get /users/{user_id}
export { UserSchema as UserGetByIdRsSchema, type User as UserGetByIdRs };

// response get /users/me
export { UserSchema as UserSelfGetRsSchema, type User as UserSelfGetRs };

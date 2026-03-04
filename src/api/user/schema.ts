// #region imports
import * as z from 'zod';
import { TariffSchema } from '@/api/tariff/schema';
// #endregion

export const UserRightsSchema = z.object({
  is_servers_editor: z.boolean(),
  is_users_editor: z.boolean(),
  is_transactions_editor: z.boolean(),
  is_tariffs_editor: z.boolean(),
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

export const UserPatchSchema = z.object({
  telegram_id: z.number().int().optional(),
  tariff_id: z.uuid().optional(),
  description: z.string().optional(),
  rights: UserRightsSchema.optional(),
  settings: UserSettingsSchema.optional(),
});

export type UserPatch = z.infer<typeof UserPatchSchema>;

export const convertUser = (user: User): UserPatch => {
  return {
    telegram_id: user.telegram_id,
    tariff_id: user.tariff.id,
    description: user.description,
    rights: user.rights,
    settings: user.settings,
  };
};

import { z } from 'zod';
import { type MessageRs, MessageRsSchema } from '@/api/base/schema';

export const UserSchema = z.object({
  id: z.string().uuid(),
  telegram_id: z.number().int(),
  telegram_username: z.string(),
  balance: z.number(),
  created_date: z.string().datetime({ local: true }),
  rights: z.object({
    is_server_editor: z.boolean(),
    is_transaction_editor: z.boolean(),
    is_active_period_editor: z.boolean(),
    is_tariff_editor: z.boolean(),
    is_member_rights_editor: z.boolean(),
    is_admin_rights_editor: z.boolean(),
    is_control_panel_user: z.boolean(),
    is_verified: z.boolean(),
  }),
  settings: z.object({
    auto_pay: z.boolean(),
    is_active: z.boolean(),
    get_traffic_notifications: z.boolean(),
  }),
});

export type User = z.infer<typeof UserSchema>;

// response get /user
export { UserSchema as UserGetRsSchema, type User as UserGetRs };

// request patch /user/{user_id}
export const UserPatchRqSchema = z.object({
  telegram_id: z.number().int().optional(),
  rights: z
    .object({
      is_server_editor: z.boolean().optional(),
      is_transaction_editor: z.boolean().optional(),
      is_active_period_editor: z.boolean().optional(),
      is_tariff_editor: z.boolean().optional(),
      is_member_rights_editor: z.boolean().optional(),
      is_admin_rights_editor: z.boolean().optional(),
      is_control_panel_user: z.boolean().optional(),
      is_verified: z.boolean().optional(),
    })
    .optional(),
  settings: z
    .object({
      auto_pay: z.boolean().optional(),
      is_active: z.boolean().optional(),
      get_traffic_notifications: z.boolean().optional(),
    })
    .optional(),
});

export type UserPatchRq = z.infer<typeof UserPatchRqSchema>;

export { MessageRsSchema as UserPatchRsSchema, type MessageRs as UserPatchRs };

// response get /user/all
export const UserAllGetRsSchema = z.array(UserSchema);

export type UserAllGetRs = z.infer<typeof UserAllGetRsSchema>;

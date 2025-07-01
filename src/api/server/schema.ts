import z from 'zod';
import { MessageRsSchema, type MessageRs } from '../base/schema';

export const ServerSchema = z.object({
  id: z.string().uuid(),
  ip: z.string(),
  panel_path: z.string(),
  country_code: z.string(),
  is_available: z.boolean(),
  display_name: z.string(),
  login: z.string(),
  password: z.string(),
  starting_date: z.coerce.date(),
  closing_date: z.coerce.date(),
});

export type Server = z.infer<typeof ServerSchema>;

// response get /server/all
export const ServerAllGetRsSchema = z.array(ServerSchema);

export type ServerAllGetRs = z.infer<typeof ServerAllGetRsSchema>;

// request post /server
export const ServerPostRqSchema = z.object({
  id: z.string().uuid(),
  ip: z.string(),
  panel_path: z.string(),
  country_code: z.string(),
  is_available: z.boolean(),
  display_name: z.string(),
  login: z.string(),
  password: z.string(),
  starting_date: z.coerce.date(),
  closing_date: z.coerce.date(),
});

export type ServerPostRq = z.infer<typeof ServerPostRqSchema>;

// response post /server
export { MessageRsSchema as ServerPostRsSchema, type MessageRs as ServerPostRs };

// request patch /server/{server_id}
export const ServerPatchRqSchema = z.object({
  ip: z.string().optional(),
  panel_path: z.string().optional(),
  country_code: z.string().optional(),
  is_available: z.boolean().optional(),
  display_name: z.string().optional(),
  login: z.string().optional(),
  password: z.string().optional(),
  starting_date: z.coerce.date().optional(),
  closing_date: z.coerce.date().optional(),
});

export type ServerPatchRq = z.infer<typeof ServerPatchRqSchema>;

// response patch /server/{server_id}
export { MessageRsSchema as ServerPatchRsSchema, type MessageRs as ServerPatchRs };

// #region imports
import * as z from 'zod';
import { MessageRsSchema, type MessageRs } from '@/api/base/schema';
// #endregion

export const ServerSchema = z.object({
  id: z.uuid(),
  ip: z.ipv4(),
  description: z.string(),
  country_code: z.string().min(2).max(2),
  is_available: z.boolean(),
  display_name: z.string(),
  starting_date: z.coerce.date(),
  closing_date: z.coerce.date(),
  panel_port: z.number().int().min(0).max(65535),
  port_generator_port: z.number().int().min(0).max(65535),
  web_path: z.string(),
  login: z.string(),
  password: z.string(),
  vless_reality_id: z.number().int(),
  vless_reality_port: z.number().int().min(0).max(65535),
  vless_reality_domain_short_id: z.string(),
  vless_reality_public_key: z.string(),
  vless_reality_private_key: z.string(),
});

export type Server = z.infer<typeof ServerSchema>;

// request get /servers
export const ServerGetRqSchema = z.object({
  offset: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional(),
});

export type ServerGetRq = z.infer<typeof ServerGetRqSchema>;

// response get /servers
export const ServerGetRsSchema = z.array(ServerSchema);

export type ServerGetRs = z.infer<typeof ServerGetRsSchema>;

// request post /servers
export const ServerPostRqSchema = ServerSchema.omit({
  id: true,
});

export type ServerPostRq = z.infer<typeof ServerPostRqSchema>;

// response post /servers
export { MessageRsSchema as ServerPostRsSchema, type MessageRs as ServerPostRs };

// response get /servers/count
export const ServerCountRsSchema = z.number().int().min(0);

export type ServerCountRs = z.infer<typeof ServerCountRsSchema>;

// request get /servers/{server_id}
export const ServerGetByIdRqSchema = z.object({
  server_id: z.uuid(),
});

export type ServerGetByIdRq = z.infer<typeof ServerGetByIdRqSchema>;

// response get /servers/{server_id}
export { ServerSchema as ServerGetByIdRsSchema, type Server as ServerGetByIdRs };

// request patch /servers/{server_id}
export const ServerPatchRqSchema = ServerSchema.omit({ id: true }).partial();

export type ServerPatchRq = z.infer<typeof ServerPatchRqSchema>;

// response patch /servers/{server_id}
export { MessageRsSchema as ServerPatchRsSchema, type MessageRs as ServerPatchRs };

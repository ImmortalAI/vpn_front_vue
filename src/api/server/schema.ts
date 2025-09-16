import * as z from 'zod';
import { MessageRsSchema, type MessageRs } from '@/api/base/schema';

export const ServerSchema = z.object({
  id: z.uuid(),
  ip: z.string(),
  description: z.string(),
  country_code: z.string(),
  is_available: z.boolean(),
  display_name: z.string(),
  starting_date: z.coerce.date(),
  closing_date: z.coerce.date(),
  panel_port: z.number().int(),
  port_generator_port: z.number().int(),
  web_path: z.string(),
  login: z.string(),
  password: z.string(),
});

export type Server = z.infer<typeof ServerSchema>;

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

// request patch /servers/{server_id}
export const ServerPatchRqSchema = ServerSchema.omit({ id: true }).partial();

export type ServerPatchRq = z.infer<typeof ServerPatchRqSchema>;

// response patch /servers/{server_id}
export { MessageRsSchema as ServerPatchRsSchema, type MessageRs as ServerPatchRs };

// #region imports
import * as z from 'zod';
import { MessageRsSchema, type MessageRs } from '@/api/base/schema';
// #endregion

export const InboundSchema = z.object({
  id: z.uuid(),
  inbound_id: z.int(),
  protocol: z.string(),
  template: z.string(),
  name: z.string(),
  description: z.string(),
  is_available: z.boolean(),
});

export type Inbound = z.infer<typeof InboundSchema>;

export const ServerSchema = z.object({
  id: z.uuid(),
  ip: z.ipv4(),
  secured: z.boolean(),
  description: z.string(),
  country_code: z.string().min(2).max(2),
  display_name: z.string(),
  starting_date: z.coerce.date(),
  closing_date: z.coerce.date(),
  panel_port: z.number().int().min(0).max(65535),
  panel_web_path: z.string(),
  panel_login: z.string(),
  panel_password: z.string(),
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
export { ServerSchema as ServerPostRsSchema, type Server as ServerPostRs };

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

// request get /servers/inbounds
export const InboundsGetRqSchema = z.object({
  server_id: z.uuid().optional(),
  offset: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional(),
});

export type InboundsGetRq = z.infer<typeof InboundsGetRqSchema>;

// response get /servers/inbounds
export const InboundsGetRsSchema = z.array(InboundSchema);

export type InboundsGetRs = z.infer<typeof InboundsGetRsSchema>;

// request get /servers/inbounds/count
export const InboundsCountRqSchema = z.object({
  server_id: z.uuid().optional(),
});

export type InboundsCountRq = z.infer<typeof InboundsCountRqSchema>;

// response get /servers/inbounds/count
export const InboundsCountRsSchema = z.number().int().min(0);

export type InboundsCountRs = z.infer<typeof InboundsCountRsSchema>;

// request post /servers/inbounds/{server_id}
export const InboundsPostRqSchema = InboundSchema.omit({ id: true });

export type InboundsPostRq = z.infer<typeof InboundsPostRqSchema>;

// response post /servers/inbounds/{server_id}
export { InboundSchema as InboundsPostRsSchema, type Inbound as InboundsPostRs };

// response get /servers/inbounds/{server_inbound_id}
export { InboundSchema as InboundsGetByIdRsSchema, type Inbound as InboundsGetByIdRs };

// request patch /servers/inbounds/{server_inbound_id}
export const InboundsPatchRqSchema = InboundSchema.omit({ id: true }).partial();

export type InboundsPatchRq = z.infer<typeof InboundsPatchRqSchema>;

// response patch /servers/inbounds/{server_inbound_id}
export { MessageRsSchema as InboundsPatchRsSchema, type MessageRs as InboundsPatchRs };

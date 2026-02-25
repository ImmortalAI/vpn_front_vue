// #region imports
import * as z from 'zod';
import { MessageRsSchema, PaginationSchema, type MessageRs } from '@/api/base/schema';
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

export const getEmptyServer = (): Server => ({
  id: '',
  ip: '',
  secured: false,
  description: '',
  country_code: '',
  display_name: '',
  starting_date: new Date(),
  closing_date: new Date(),
  panel_port: 443,
  panel_web_path: '',
  panel_login: '',
  panel_password: '',
});

// request post /servers
export const NewServerSchema = ServerSchema.omit({
  id: true,
});

export type NewServer = z.infer<typeof NewServerSchema>;

// request patch /servers/{server_id}
export const UpdateServerSchema = ServerSchema.omit({ id: true }).partial();

export type UpdateServer = z.infer<typeof UpdateServerSchema>;

// response patch /servers/{server_id}
export { ServerSchema as ServerPatchRsSchema, type Server as ServerPatchRs };

export const InboundPaginationSchema = PaginationSchema.extend({
  server_id: z.uuid().optional(),
});

export type InboundPagination = z.infer<typeof InboundPaginationSchema>;

export const NewInboundSchema = InboundSchema.omit({ id: true });

export type NewInbound = z.infer<typeof NewInboundSchema>;

export const UpdateInboundSchema = InboundSchema.omit({ id: true }).partial();

export type UpdateInbound = z.infer<typeof UpdateInboundSchema>;

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

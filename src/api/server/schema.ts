// #region imports
import * as z from 'zod';
import { PaginationSchema } from '@/api/base/schema';
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

export const getEmptyInbound = (): Inbound => ({
  id: '',
  inbound_id: 0,
  protocol: '',
  template: '',
  name: '',
  description: '',
  is_available: false,
});

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

export const NewServerSchema = ServerSchema.omit({
  id: true,
});

export type NewServer = z.infer<typeof NewServerSchema>;

export const PartialServerSchema = ServerSchema.omit({ id: true }).partial();

export type PartialServer = z.infer<typeof PartialServerSchema>;

export const InboundPaginationSchema = PaginationSchema.extend({
  server_id: z.uuid().optional(),
});

export type InboundPagination = z.infer<typeof InboundPaginationSchema>;

export const NewInboundSchema = InboundSchema.omit({ id: true });

export type NewInbound = z.infer<typeof NewInboundSchema>;

export const UpdateInboundSchema = InboundSchema.omit({ id: true }).partial();

export type UpdateInbound = z.infer<typeof UpdateInboundSchema>;

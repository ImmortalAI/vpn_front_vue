// #region imports
import * as z from 'zod';
import { MessageRsSchema, type MessageRs } from '@/api/base/schema';
// #endregion

export const TicketMessageSchema = z.object({
  id: z.uuid(),
  message: z.string(),
  date: z.coerce.date(),
});

export type TicketMessage = z.infer<typeof TicketMessageSchema>;

export const TicketSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  title: z.string(),
  opening_data: z.coerce.date(),
  is_open: z.boolean(),
  messages: z.array(TicketMessageSchema),
});

export type Ticket = z.infer<typeof TicketSchema>;

// response get /tickets
export const TicketGetRsSchema = z.array(TicketSchema);

export type TicketGetRs = z.infer<typeof TicketGetRsSchema>;

// response get /tickets/{ticket_id}
export { TicketSchema as TicketGetByIdRsSchema, type Ticket as TicketGetByIdRs };

// request post /tickets/{ticket_id}/messages
export const TicketNewMessageRqSchema = z.object({
  message: z.string(),
});

export type TicketNewMessageRq = z.infer<typeof TicketNewMessageRqSchema>;

// response post /tickets/{ticket_id}/messages
export { MessageRsSchema as TicketNewMessageRsSchema, type MessageRs as TicketNewMessageRs };

// response patch /tickets/{ticket_id}/close
export {
  MessageRsSchema as TicketCloseTicketPatchRsSchema,
  type MessageRs as TicketCloseTicketPatchRs,
};

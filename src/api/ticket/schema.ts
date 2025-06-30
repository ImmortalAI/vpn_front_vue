import { z } from 'zod';
import { MessageRsSchema, type MessageRs } from '../base/schema';

export const TicketMessageSchema = z.object({
  id: z.string().uuid(),
  message: z.string(),
  date: z.string().datetime({ local: true }),
});

export type TicketMessage = z.infer<typeof TicketMessageSchema>;

export const TicketSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  opening_data: z.string().datetime({ local: true }),
  is_open: z.boolean(),
  messages: z.array(TicketMessageSchema),
});

export type Ticket = z.infer<typeof TicketSchema>;

// response get /ticket
export const TicketGetRsSchema = z.array(TicketSchema);

export type TicketGetRs = z.infer<typeof TicketGetRsSchema>;

// response get /ticket/{ticket_id}
export { TicketSchema as TicketGetByIdRsSchema, type Ticket as TicketGetByIdRs };

// request post /ticket/new_message/{ticket_id}
export const TicketNewMessageRqSchema = z.object({
  message: z.string(),
});

export type TicketNewMessageRq = z.infer<typeof TicketNewMessageRqSchema>;

// response post /ticket/new_message/{ticket_id}
export { MessageRsSchema as TicketNewMessageRsSchema, type MessageRs as TicketNewMessageRs };

// request patch /ticket/close_ticket/{ticket_id}
export {
  MessageRsSchema as TicketCloseTicketPatchRsSchema,
  type MessageRs as TicketCloseTicketPatchRs,
};

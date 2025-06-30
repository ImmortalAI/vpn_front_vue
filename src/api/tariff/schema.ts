import z from 'zod';
import { type MessageRs, MessageRsSchema } from '../base/schema';

export const TariffSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  duration: z.number(),
  price: z.number(),
  price_of_traffic_reset: z.number(),
  traffic: z.number(),
  is_special: z.boolean(),
});

export type Tariff = z.infer<typeof TariffSchema>;

// response get /tariff/all
export const TariffAllGetRsSchema = z.array(TariffSchema);

export type TariffAllGetRs = z.infer<typeof TariffAllGetRsSchema>;

// response get /tariff/{tariff_id}
export { TariffSchema as TariffGetRsSchema, type Tariff as TariffGetRs };

// request post /tariff
export const TariffPostRqSchema = z.object({
  name: z.string(),
  duration: z.number(),
  price: z.number(),
  price_of_traffic_reset: z.number(),
  traffic: z.number(),
  is_special: z.boolean(),
});

export type TariffPostRq = z.infer<typeof TariffPostRqSchema>;

// response post /tariff
export { MessageRsSchema as TariffPostRsSchema, type MessageRs as TariffPostRs };

// request patch /tariff/{tariff_id}
export const TariffPatchRqSchema = z.object({
  name: z.string().optional(),
  duration: z.number().optional(),
  price: z.number().optional(),
  price_of_traffic_reset: z.number().optional(),
  traffic: z.number().optional(),
});

export type TariffPatchRq = z.infer<typeof TariffPatchRqSchema>;

// response patch /tariff/{tariff_id}
export { MessageRsSchema as TariffPatchRsSchema, type MessageRs as TariffPatchRs };

// response delete /tariff/{tariff_id}
export { MessageRsSchema as TariffDeleteRsSchema, type MessageRs as TariffDeleteRs };

// #region imports
import * as z from 'zod';
import { type MessageRs, MessageRsSchema } from '@/api/base/schema';
// #endregion

export const TariffSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  duration: z.number().int().nonnegative(),
  price: z.number().int().nonnegative(),
  price_of_traffic_reset: z.number().int().nonnegative(),
  traffic: z.number().int().nonnegative(),
  with_access: z.boolean(),
  with_unavailable_inbounds: z.boolean(),
  is_special: z.boolean(),
});

export const getEmptyTariff = (): Tariff => ({
  id: '',
  name: '',
  description: '',
  duration: 0,
  price: 0,
  price_of_traffic_reset: 0,
  traffic: 0,
  with_access: false,
  with_unavailable_inbounds: false,
  is_special: false,
});

export type Tariff = z.infer<typeof TariffSchema>;

// response get /tariffs
export const TariffAllGetRsSchema = z.array(TariffSchema);

export type TariffAllGetRs = z.infer<typeof TariffAllGetRsSchema>;

// response get /tariffs/{tariff_id}
export { TariffSchema as TariffGetRsSchema, type Tariff as TariffGetRs };

// request post /tariffs
export const TariffPostRqSchema = TariffSchema.omit({ id: true });

export type TariffPostRq = z.infer<typeof TariffPostRqSchema>;

// response post /tariffs
export { TariffSchema as TariffPostRsSchema, type Tariff as TariffPostRs };

// request patch /tariffs/{tariff_id}
export const TariffPatchRqSchema = TariffSchema.omit({ id: true }).partial();

export type TariffPatchRq = z.infer<typeof TariffPatchRqSchema>;

// response patch /tariffs/{tariff_id}
export { TariffSchema as TariffPatchRsSchema, type Tariff as TariffPatchRs };

// response delete /tariffs/{tariff_id}
export { MessageRsSchema as TariffDeleteRsSchema, type MessageRs as TariffDeleteRs };

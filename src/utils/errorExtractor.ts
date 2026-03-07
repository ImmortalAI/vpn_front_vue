import type { MessageRs } from '@/api/base/schema';
import { isAxiosError } from 'axios';
import { ZodError } from 'zod';

export default function errorExtractor(error: unknown): string {
  if (isAxiosError(error)) {
    return (error.response?.data as MessageRs).message ?? 'Unknown error';
  }
  if (error instanceof ZodError) {
    return error.message;
  }
  return 'Unknown error';
}

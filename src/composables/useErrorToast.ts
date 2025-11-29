import { isAxiosError, type AxiosError } from 'axios';
import { useToast } from 'primevue/usetoast';
import { ZodError } from 'zod';

export default () => {
  const toast = useToast();

  const errorAxios = (error: AxiosError) => {
    toast.add({
      severity: 'error',
      summary: 'Oops... something went wrong',
      detail: (error.response?.data as { detail: string }).detail ?? 'Nobody knows what happened',
      life: 3000,
    });
  };

  const errorZod = (error: ZodError) => {
    toast.add({
      severity: 'error',
      summary: 'Your input is invalid',
      detail: error.message,
      life: 3000,
    });
  };

  const safeExecute = async <T>(func: () => Promise<T>): Promise<T | null> => {
    try {
      return await func();
    } catch (err) {
      if (isAxiosError(err)) {
        errorAxios(err);
        return null;
      } else if (err instanceof ZodError) {
        errorZod(err);
        return null;
      } else {
        toast.add({
          severity: 'error',
          summary: 'An unexpected error occurred',
          detail: 'Please try again later',
          life: 3000,
        });
        return null;
      }
    }
  };

  return { errorAxios, errorZod, safeExecute };
};

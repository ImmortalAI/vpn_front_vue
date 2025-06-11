import type { AxiosError } from 'axios';
import { useToast } from 'primevue/usetoast';

export default () => {
  const toast = useToast();
  const error = (error: AxiosError) => {
    toast.add({
      severity: 'error',
      summary: 'Oops... что-то пошло не так',
      detail: (error.response?.data as { detail: string }).detail ?? 'Что-то пошло не так',
      life: 3000,
    });
  };
  return { error };
};

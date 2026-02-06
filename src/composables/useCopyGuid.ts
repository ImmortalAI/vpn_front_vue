import { useClipboard } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';

export default function useCopyGuid() {
  const clipboard = useClipboard();
  const toast = useToast();

  const copyGuid = (guid: string) => {
    if (clipboard.isSupported) {
      clipboard.copy(guid);

      toast.add({
        severity: 'success',
        summary: 'Copied to clipboard',
        detail: guid,
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Clipboard not supported',
        life: 3000,
      });
    }
  };

  return {
    copyGuid,
  };
}

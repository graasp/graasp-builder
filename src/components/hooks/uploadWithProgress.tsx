import { useRef } from 'react';
import { Id, toast } from 'react-toastify';

import type { AxiosProgressEvent } from 'axios';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

export const useUploadWithProgress = (): {
  update: (p: AxiosProgressEvent) => void;
  close: () => void;
  closeAndShowError: (e: Error) => void;
  show: (p?: number) => void;
} => {
  const { t: translateBuilder } = useBuilderTranslation();

  // we need to keep a reference of the toastId to be able to update it
  const toastId = useRef<Id | null>(null);

  const show = (progress = 0) => {
    toastId.current = toast.info(
      translateBuilder(BUILDER.UPLOAD_NOTIFICATION_LOADING),
      {
        progress,
        position: 'bottom-left',
      },
    );
  };

  const update = (e: AxiosProgressEvent) => {
    const { progress } = e;
    // check if we already displayed a toast
    if (toastId.current === null && progress && progress < 1) {
      show(progress);
    }
    if (toastId.current) {
      toast.update(toastId.current, { progress });
    }
  };

  const close = () => {
    if (toastId.current) {
      toast.done(toastId.current);
      // does not work correctly in chrome, workaround solution to close the notification
      toast.update(toastId.current, {
        type: 'success',
        render: translateBuilder(BUILDER.UPLOAD_NOTIFICATION_COMPLETE),
        autoClose: 1000,
        progress: null,
      });
      toastId.current = null;
    }
  };
  const closeAndShowError = (e: Error) => {
    close();
    toast.error(e.message);
    if (toastId.current) {
      toastId.current = null;
    }
  };

  return { show, update, close, closeAndShowError };
};

import { useRef } from 'react';
import { Id, toast } from 'react-toastify';

import { AxiosProgressEvent } from 'axios';

import { useBuilderTranslation } from '@/config/i18n';

// eslint-disable-next-line import/prefer-default-export
export const useUploadWithProgress = (): {
  onUploadProgress: (p: AxiosProgressEvent) => void;
  done: () => void;
} => {
  const { t: translateBuilder } = useBuilderTranslation();

  // we need to keep a reference of the toastId to be able to update it
  const toastId = useRef<Id | null>(null);

  const onUploadProgress = ({ progress }: AxiosProgressEvent) => {
    // check if we already displayed a toast
    if (toastId.current === null && progress && progress < 1) {
      toastId.current = toast.info(translateBuilder('Uploading...'), {
        progress,
      });
    }
    if (toastId.current) {
      toast.update(toastId.current, { progress });
    }
  };

  const done = () => {
    if (toastId.current) {
      toast.done(toastId.current);
      toastId.current = null;
    }
  };

  return { onUploadProgress, done };
};

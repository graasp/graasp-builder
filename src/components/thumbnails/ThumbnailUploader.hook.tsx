import { useEffect, useState } from 'react';

import { DiscriminatedItem, ThumbnailSize } from '@graasp/sdk';

import { AxiosProgressEvent } from 'axios';

import { hooks, mutations } from '@/config/queryClient';

import { useUploadWithProgress } from '../hooks/uploadWithProgress';

const { useDeleteItemThumbnail } = mutations;
const { useItemThumbnailUrl } = hooks;

type ItemThumbnail = {
  hasThumbnail?: boolean;
  url?: string;
};

type Props = {
  item: DiscriminatedItem;
  thumbnailSize?: (typeof ThumbnailSize)[keyof typeof ThumbnailSize];
};

type ThumbnailUploadPayload = { thumbnail?: Blob };

type UseThumbnailUploader = {
  isThumbnailLoading: boolean;
  isThumbnailUploading: boolean;
  isUploadingError: boolean;
  itemThumbnail: ItemThumbnail;
  uploadingProgress: number;
  handleDelete: () => void;
  onThumbnailUpload: (payload: ThumbnailUploadPayload) => void;
};

export const useThumbnailUploader = ({
  item,
  thumbnailSize = ThumbnailSize.Medium,
}: Props): UseThumbnailUploader => {
  const { mutate: deleteThumbnail } = useDeleteItemThumbnail();
  const { mutateAsync: uploadItemThumbnail } =
    mutations.useUploadItemThumbnail();
  const {
    update,
    close: closeNotification,
    closeAndShowError,
  } = useUploadWithProgress();

  const { id: itemId, settings } = item;
  const {
    data: thumbnailUrl,
    isInitialLoading,
    fetchStatus,
  } = useItemThumbnailUrl({
    id: itemId,
    size: thumbnailSize,
  });

  const [itemThumbnail, setItemThumbnail] = useState<ItemThumbnail>({});
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [isUploadingError, setIsUploadingError] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(0);
  // shouldLoad is used to avoid having a loading state between the blob and the AWS thumbnail url.
  const [shouldLoad, setShouldLoad] = useState(true);

  // Because in QueryClient v.4, isInitialLoading is true when query is disabled, checking the fetchStatus is needed.
  // https://github.com/TanStack/query/issues/3584
  const isThumbnailLoading =
    shouldLoad && isInitialLoading && fetchStatus !== 'idle';

  useEffect(() => {
    setItemThumbnail({
      url: thumbnailUrl,
      hasThumbnail: settings.hasThumbnail,
    });

    if (thumbnailUrl) {
      setShouldLoad(false);
    }
  }, [settings, thumbnailUrl]);

  const handleDelete = () => {
    setItemThumbnail({ hasThumbnail: false, url: undefined });
    deleteThumbnail(itemId);
  };

  const onThumbnailUpload = async (payload: ThumbnailUploadPayload) => {
    const { thumbnail } = payload;
    if (!thumbnail) {
      return;
    }
    try {
      setIsThumbnailUploading(true);
      await uploadItemThumbnail({
        id: itemId,
        file: thumbnail,
        onUploadProgress: (e: AxiosProgressEvent) => {
          setUploadingProgress((e.progress ?? 0) * 100);
          update(e);
        },
      });
      closeNotification();
    } catch (error) {
      console.error(error);
      setIsUploadingError(true);
      closeAndShowError(error as Error);
    } finally {
      setIsThumbnailUploading(false);
      setUploadingProgress(0);
    }
  };

  return {
    isThumbnailUploading,
    isThumbnailLoading,
    isUploadingError,
    itemThumbnail,
    uploadingProgress,
    handleDelete,
    onThumbnailUpload,
  };
};

export default useThumbnailUploader;

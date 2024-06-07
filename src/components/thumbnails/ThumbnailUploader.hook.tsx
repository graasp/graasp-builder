import { useEffect, useState } from 'react';

import { DiscriminatedItem, ThumbnailSize } from '@graasp/sdk';

import Uppy from '@uppy/core';

import { hooks, mutations } from '@/config/queryClient';
import { configureThumbnailUppy } from '@/utils/uppy';

const { useDeleteItemThumbnail, useUploadFiles } = mutations;
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
  openStatusBar: boolean;
  uppy?: Uppy;
  uploadingProgress: number;
  closeStatusBar: () => void;
  handleDelete: () => void;
  onThumbnailUpload: (payload: ThumbnailUploadPayload) => void;
};

export const useThumbnailUploader = ({
  item,
  thumbnailSize = ThumbnailSize.Medium,
}: Props): UseThumbnailUploader => {
  const { mutate: deleteThumbnail } = useDeleteItemThumbnail();
  const { mutate: onFileUploadComplete } = useUploadFiles();

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
  const [uppy, setUppy] = useState<Uppy>();
  const [openStatusBar, setOpenStatusBar] = useState(false);
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

  const closeStatusBar = () => setOpenStatusBar(false);

  const updateHasThumbnail = (hasThumbnail: boolean) =>
    setItemThumbnail((current) => ({ ...current, hasThumbnail }));

  useEffect(() => {
    setUppy(
      configureThumbnailUppy({
        itemId,
        onProgress: (progression) => {
          setUploadingProgress(progression);
        },
        onUpload: () => {
          // remove waiting files
          uppy?.cancelAll();
          setUploadingProgress(0);
          setOpenStatusBar(true);
          updateHasThumbnail(true);
          setIsThumbnailUploading(true);
        },
        onError: (error: Error) => {
          onFileUploadComplete({ id: itemId, error });
          setIsThumbnailUploading(false);
          setIsUploadingError(true);
          updateHasThumbnail(settings.hasThumbnail ?? false);
        },
        onComplete: (result: {
          successful: { response: { body: unknown } }[];
        }) => {
          if (result?.successful?.length) {
            const data = result.successful[0].response.body;
            setIsUploadingError(false);
            onFileUploadComplete({ id: itemId, data });
          }
          // close progress bar of uppy
          closeStatusBar();
          setIsThumbnailUploading(false);
          setShouldLoad(false);
          return false;
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const handleDelete = () => {
    setItemThumbnail({ hasThumbnail: false, url: undefined });
    deleteThumbnail(itemId);
  };

  const onThumbnailUpload = (payload: ThumbnailUploadPayload) => {
    const { thumbnail } = payload;
    if (!thumbnail) {
      return;
    }
    try {
      // remove waiting files
      uppy?.cancelAll();
      uppy?.addFile({
        type: thumbnail.type,
        data: thumbnail,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    isThumbnailUploading,
    isThumbnailLoading,
    isUploadingError,
    itemThumbnail,
    openStatusBar,
    uppy,
    uploadingProgress,
    closeStatusBar,
    handleDelete,
    onThumbnailUpload,
  };
};

export default useThumbnailUploader;

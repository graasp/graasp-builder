import { useEffect, useState } from 'react';

import { PackedItem, ThumbnailSize, ThumbnailsBySize } from '@graasp/sdk';

import { AxiosProgressEvent } from 'axios';

import { mutations } from '@/config/queryClient';

import { useUploadWithProgress } from '../hooks/uploadWithProgress';

const { useDeleteItemThumbnail } = mutations;

type ItemThumbnail = {
  hasThumbnail?: boolean;
  url?: string;
};

type Props = {
  item: PackedItem;
  thumbnailSize?: keyof ThumbnailsBySize;
};

type ThumbnailUploadPayload = { thumbnail?: Blob };

type UseThumbnailUploader = {
  isThumbnailUploading: boolean;
  isUploadingError: boolean;
  itemThumbnail: ItemThumbnail;
  uploadingProgress: number;
  handleDelete: () => void;
  onThumbnailUpload: (payload: ThumbnailUploadPayload) => Promise<void>;
};

export const useThumbnailUploader = ({
  item,
  thumbnailSize = ThumbnailSize.Medium,
}: Props): UseThumbnailUploader => {
  const { mutate: deleteThumbnail } = useDeleteItemThumbnail();
  const { mutateAsync: uploadItemThumbnail } =
    mutations.useUploadItemThumbnail();
  const { update, close: closeNotification } = useUploadWithProgress();

  const { id: itemId } = item;
  const thumbnailUrl = item.thumbnails?.[thumbnailSize];

  const [itemThumbnail, setItemThumbnail] = useState<ItemThumbnail>({
    url: thumbnailUrl,
    hasThumbnail: Boolean(thumbnailUrl),
  });
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [isUploadingError, setIsUploadingError] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState(0);

  const updateHasThumbnail = (hasThumbnail: boolean) =>
    setItemThumbnail((prev) => ({
      ...prev,
      hasThumbnail,
    }));

  useEffect(() => {
    setItemThumbnail((prev) => ({
      url: thumbnailUrl,
      // As we set hasThumbnail = true during the upload,
      // we only update it if the previous state is false,
      // meaning that no upload occured and the item doesn't have a thumbnail.
      // This solve some flickering of the warning tooltip after the upload.
      hasThumbnail: prev.hasThumbnail || Boolean(thumbnailUrl),
    }));
  }, [thumbnailUrl]);

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
      // As we are uploading the thumbnail, we can assume that the item has a thumbnail.
      // If an error occur, we have to update the hasThumbnail state.
      updateHasThumbnail(true);
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
      updateHasThumbnail(false);
      closeNotification(error as Error);
    } finally {
      setIsThumbnailUploading(false);
      setUploadingProgress(0);
    }
  };

  return {
    isThumbnailUploading,
    isUploadingError,
    itemThumbnail,
    uploadingProgress,
    handleDelete,
    onThumbnailUpload,
  };
};

export default useThumbnailUploader;

import { FormEventHandler, useRef, useState } from 'react';

import { Dialog, Stack, styled } from '@mui/material';

import {
  DiscriminatedItem,
  ItemType,
  ThumbnailSize,
  getLinkThumbnailUrl,
} from '@graasp/sdk';

import { useUploadWithProgress } from '@/components/hooks/uploadWithProgress';
import { THUMBNAIL_SETTING_UPLOAD_INPUT_ID } from '@/config/selectors';

import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, mutations } from '../../../config/queryClient';
import { BUILDER } from '../../../langs/constants';
import CropModal, { MODAL_TITLE_ARIA_LABEL_ID } from '../../common/CropModal';
import ThumbnailWithControls from './ThumbnailWithControls';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type Props = { item: DiscriminatedItem };

const ThumbnailSetting = ({ item }: Props): JSX.Element | null => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [fileSource, setFileSource] = useState<string>();
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutateAsync: uploadItemThumbnail } =
    mutations.useUploadItemThumbnail();
  const { update, close: closeNotification } = useUploadWithProgress();
  const { mutate: deleteThumbnail } = mutations.useDeleteItemThumbnail();
  const { id: itemId } = item;
  const { data: thumbnailUrl, isLoading } = hooks.useItemThumbnailUrl({
    id: itemId,
    size: ThumbnailSize.Medium,
  });

  const onSelectFile: FormEventHandler<HTMLInputElement> = (e) => {
    const t = e.target as HTMLInputElement;
    if (t.files && t.files?.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setFileSource(reader.result as string),
      );
      reader.readAsDataURL(t.files?.[0]);
      setShowCropModal(true);
    }
  };

  const onClose = () => {
    setShowCropModal(false);
    if (inputRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      inputRef.current.value = null;
    }
  };

  const onConfirmCrop = (croppedImage: Blob | null) => {
    onClose();

    if (!croppedImage) {
      return console.error('croppedImage is not defined');
    }
    // submit cropped image
    try {
      // remove waiting files
      uploadItemThumbnail({
        // type: croppedImage.type,
        file: croppedImage,
        id: item.id,
        onUploadProgress: update,
      }).then(() => {
        closeNotification();
      });
    } catch (error) {
      console.error(error);
    }

    return true;
  };

  const onDelete = () => {
    deleteThumbnail(itemId);
  };

  const onEdit = () => {
    inputRef.current?.click();
  };

  const alt = translateBuilder(BUILDER.THUMBNAIL_SETTING_MY_THUMBNAIL_ALT);

  let imgUrl = thumbnailUrl;
  if (!imgUrl && item.type === ItemType.LINK) {
    imgUrl = getLinkThumbnailUrl(item.extra);
  }

  return (
    <>
      <Stack spacing={2} mb={3} alignItems="center">
        <ThumbnailWithControls
          item={item}
          alt={alt}
          url={imgUrl}
          isLoading={isLoading}
          onDelete={onDelete}
          onEdit={onEdit}
          hasThumbnail={item.settings?.hasThumbnail}
        />
        <VisuallyHiddenInput
          id={THUMBNAIL_SETTING_UPLOAD_INPUT_ID}
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          ref={inputRef}
        />
      </Stack>
      {fileSource && (
        <Dialog
          open={showCropModal}
          onClose={onClose}
          aria-labelledby={MODAL_TITLE_ARIA_LABEL_ID}
        >
          <CropModal
            onClose={onClose}
            src={fileSource}
            onConfirm={onConfirmCrop}
          />
        </Dialog>
      )}
    </>
  );
};

export default ThumbnailSetting;

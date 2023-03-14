import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useEffect, useRef, useState } from 'react';

import { ItemType } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { Thumbnail } from '@graasp/ui';

import {
  THUMBNAIL_SETTING_MAX_HEIGHT,
  THUMBNAIL_SETTING_MAX_WIDTH,
} from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, mutations } from '../../../config/queryClient';
import { THUMBNAIL_SETTING_UPLOAD_BUTTON_CLASSNAME } from '../../../config/selectors';
import defaultImage from '../../../resources/avatar.png';
import { configureThumbnailUppy } from '../../../utils/uppy';
import CropModal from '../../common/CropModal';
import StatusBar from '../../file/StatusBar';

type Props = { item: ItemRecord };

const ThumbnailSetting = ({ item }: Props): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>();
  const [uppy, setUppy] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [fileSource, setFileSource] = useState<string>();
  const [openStatusBar, setOpenStatusBar] = useState(false);
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: onFileUploadComplete } = mutations.useUploadFiles();
  const itemId = item.id;
  const { data: thumbnailUrl, isLoading } = hooks.useItemThumbnailUrl({
    id: itemId,
  });

  useEffect(() => {
    setUppy(
      configureThumbnailUppy({
        itemId,
        onUpload: () => {
          setOpenStatusBar(true);
        },
        onError: (error) => {
          onFileUploadComplete({ id: itemId, error });
        },
        onComplete: (result) => {
          if (result?.successful?.length) {
            const data = result.successful[0].response.body;
            onFileUploadComplete({ id: itemId, data });
          }

          return false;
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  if (!uppy) {
    return null;
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenStatusBar(false);
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setFileSource(reader.result as string),
      );
      reader.readAsDataURL(e.target.files[0]);
      setShowCropModal(true);
    }
  };

  const onClose = () => {
    setShowCropModal(false);
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const onConfirmCrop = (croppedImage) => {
    onClose();

    // submit cropped image
    try {
      // remove waiting files
      uppy.cancelAll();

      uppy.addFile({
        name: croppedImage.name,
        type: croppedImage.type,
        data: croppedImage,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const alt = translateBuilder(BUILDER.THUMBNAIL_SETTING_MY_THUMBNAIL_ALT);
  const defaultImageComponent = <img src={defaultImage} alt={alt} />;

  return (
    <>
      {uppy && (
        <StatusBar uppy={uppy} handleClose={handleClose} open={openStatusBar} />
      )}
      <Grid container justifyContent="space-between">
        <Grid item sm={6}>
          <Typography variant="h5">
            {translateBuilder(BUILDER.SETTINGS_THUMBNAIL_TITLE)}
          </Typography>
          <Typography variant="body1">
            {translateBuilder(BUILDER.SETTINGS_THUMBNAIL_SETTINGS_INFORMATIONS)}
          </Typography>
          <input
            type="file"
            accept="image/*"
            onInput={onSelectFile}
            // onChange is successfully triggered in test
            onChange={onSelectFile}
            ref={inputRef}
            className={THUMBNAIL_SETTING_UPLOAD_BUTTON_CLASSNAME}
          />
        </Grid>
        <Grid item sm={6} textAlign="right">
          <Thumbnail
            id={itemId}
            isLoading={isLoading}
            url={
              thumbnailUrl ?? item?.extra?.[ItemType.LINK]?.thumbnails?.first()
            }
            alt={alt}
            maxWidth={THUMBNAIL_SETTING_MAX_WIDTH}
            maxHeight={THUMBNAIL_SETTING_MAX_HEIGHT}
            defaultComponent={defaultImageComponent}
          />
        </Grid>
      </Grid>
      <CropModal
        open={showCropModal}
        onClose={onClose}
        src={fileSource}
        onConfirm={onConfirmCrop}
      />
    </>
  );
};

export default ThumbnailSetting;

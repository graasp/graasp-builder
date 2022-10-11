import clsx from 'clsx';
import { Record } from 'immutable';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';
import { Thumbnail } from '@graasp/ui';

import {
  THUMBNAIL_SETTING_MAX_HEIGHT,
  THUMBNAIL_SETTING_MAX_WIDTH,
} from '../../../config/constants';
import defaultImage from '../../../config/logo.jpeg';
import { hooks, useMutation } from '../../../config/queryClient';
import { THUMBNAIL_SETTING_UPLOAD_BUTTON_CLASSNAME } from '../../../config/selectors';
import { getEmbeddedLinkExtra } from '../../../utils/itemExtra';
import { configureThumbnailUppy } from '../../../utils/uppy';
import CropModal from '../../common/CropModal';
import StatusBar from '../../file/StatusBar';

const ThumbnailSetting = ({ item }) => {
  const inputRef = useRef();
  const [uppy, setUppy] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [fileSource, setFileSource] = useState(false);
  const [openStatusBar, setOpenStatusBar] = useState(false);
  const { t } = useTranslation();
  const { mutate: onFileUploadComplete } = useMutation(
    MUTATION_KEYS.FILE_UPLOAD,
  );
  const itemId = item.id;

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
      reader.addEventListener('load', () => setFileSource(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setShowCropModal(true);
    }
  };

  const onClose = () => {
    setShowCropModal(false);
    inputRef.current.value = null;
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

  const alt = t(BUILDER.THUMBNAIL_SETTING_MY_THUMBNAIL_ALT);
  const defaultImageComponent = <img src={defaultImage} alt={alt} />;

  return (
    <>
      {uppy && (
        <StatusBar uppy={uppy} handleClose={handleClose} open={openStatusBar} />
      )}
      <Grid container justifyContent="space-between">
        <Grid item sm={6}>
          <Typography variant="h5">
            {t(BUILDER.SETTINGS_THUMBNAIL_TITLE)}
          </Typography>
          <Typography variant="body">
            {t(BUILDER.SETTINGS_THUMBNAIL_SETTINGS_INFORMATIONS)}
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
            thumbnailSrc={getEmbeddedLinkExtra(item?.extra)?.thumbnails?.get(0)}
            alt={alt}
            maxWidth={THUMBNAIL_SETTING_MAX_WIDTH}
            maxHeight={THUMBNAIL_SETTING_MAX_HEIGHT}
            useThumbnail={hooks.useItemThumbnail}
            defaultValue={defaultImageComponent}
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

ThumbnailSetting.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
};

export default ThumbnailSetting;

import React, { useState, useEffect, useRef } from 'react';
import { MUTATION_KEYS } from '@graasp/query-client';
import { Thumbnail } from '@graasp/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { configureThumbnailUppy } from '../../../utils/uppy';
import CropModal from '../../common/CropModal';
import { useMutation, hooks } from '../../../config/queryClient';
import defaultImage from '../../../config/logo.jpeg';
import {
  THUMBNAIL_SETTING_MAX_HEIGHT,
  THUMBNAIL_SETTING_MAX_WIDTH,
} from '../../../config/constants';
import { THUMBNAIL_SETTING_UPLOAD_BUTTON_CLASSNAME } from '../../../config/selectors';
import StatusBar from '../../file/StatusBar';

const useStyles = makeStyles(() => ({
  thumbnail: {
    textAlign: 'right',
  },
}));

const ThumbnailSetting = ({ item }) => {
  const inputRef = useRef();
  const [uppy, setUppy] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [fileSource, setFileSource] = useState(false);
  const [openStatusBar, setOpenStatusBar] = useState(false);
  const { t } = useTranslation();
  const classes = useStyles();
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

  return (
    <>
      {uppy && (
        <StatusBar uppy={uppy} handleClose={handleClose} open={openStatusBar} />
      )}
      <Grid container justifyContent="space-between">
        <Grid item sm={6}>
          <Typography variant="h5">{t('Thumbnail')}</Typography>
          <Typography variant="body">
            {t(
              'Provide an image to update your thumbnail. You might need to refresh the page to see the changes.',
            )}
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
        <Grid item sm={6} className={classes.thumbnail}>
          <Thumbnail
            id={itemId}
            extra={item?.extra}
            alt={t('current thumbnail')}
            maxWidth={THUMBNAIL_SETTING_MAX_WIDTH}
            maxHeight={THUMBNAIL_SETTING_MAX_HEIGHT}
            useThumbnail={hooks.useItemThumbnail}
            defaultImage={defaultImage}
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
  item: PropTypes.instanceOf(Map).isRequired,
};

export default ThumbnailSetting;

import React, { useState, useEffect, useRef } from 'react';
import { MUTATION_KEYS, routines } from '@graasp/query-client';
import { Avatar } from '@graasp/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { configureAvatarUppy } from '../../utils/uppy';
import CropModal from '../common/CropModal';
import { useMutation, hooks } from '../../config/queryClient';
import notifier from '../../config/notifier';
import defaultImage from '../../config/logo.jpeg';
import {
  THUMBNAIL_SETTING_MAX_HEIGHT,
  THUMBNAIL_SETTING_MAX_WIDTH,
} from '../../config/constants';
import { MEMBER_PROFILE_AVATAR_UPLOAD_BUTTON_CLASSNAME } from '../../config/selectors';

const { uploadAvatarRoutine } = routines;

const useStyles = makeStyles(() => ({
  thumbnail: {
    textAlign: 'right',
  },
}));

const AvatarSetting = ({ user }) => {
  const inputRef = useRef();
  const [uppy, setUppy] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [fileSource, setFileSource] = useState(false);
  const { t } = useTranslation();
  const classes = useStyles();
  const { mutate: onThumbnailUpload } = useMutation(
    MUTATION_KEYS.UPLOAD_AVATAR,
  );

  const userId = user.get('id');

  useEffect(() => {
    setUppy(
      configureAvatarUppy({
        itemId: userId,
        onError: (error) => {
          onThumbnailUpload({ id: userId, error });
        },
        onComplete: (result) => {
          // update app on complete
          // todo: improve with websockets or by receiving corresponding items
          if (result?.successful?.length) {
            onThumbnailUpload({ id: userId });
          }

          return false;
        },

        onUpload: () => {
          notifier?.({ type: uploadAvatarRoutine.REQUEST });
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!uppy) {
    return null;
  }

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
      <Grid container justifyContent="space-between">
        <Grid item sm={6}>
          <Typography variant="h5">{t('Thumbnail')}</Typography>
          <Typography variant="body">{t('Update thumbnail')}</Typography>
          <input
            type="file"
            accept="image/*"
            onInput={onSelectFile}
            // onChange is successfully triggered in test
            onChange={onSelectFile}
            ref={inputRef}
            className={MEMBER_PROFILE_AVATAR_UPLOAD_BUTTON_CLASSNAME}
          />
        </Grid>
        <Grid item sm={6} className={classes.thumbnail}>
          <Avatar
            id={userId}
            extra={user?.get('extra')}
            alt={t('current thumbnail')}
            maxWidth={THUMBNAIL_SETTING_MAX_WIDTH}
            maxHeight={THUMBNAIL_SETTING_MAX_HEIGHT}
            useAvatar={hooks.useAvatar}
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

AvatarSetting.propTypes = {
  user: PropTypes.instanceOf(Map).isRequired,
};

export default AvatarSetting;

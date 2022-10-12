import { Record } from 'immutable';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MUTATION_KEYS } from '@graasp/query-client';
import { ACCOUNT, namespaces } from '@graasp/translations';
import { Avatar } from '@graasp/ui';

import {
  THUMBNAIL_SETTING_MAX_HEIGHT,
  THUMBNAIL_SETTING_MAX_WIDTH,
} from '../../config/constants';
import defaultImage from '../../config/logo.jpeg';
import { hooks, useMutation } from '../../config/queryClient';
import { MEMBER_PROFILE_AVATAR_UPLOAD_BUTTON_CLASSNAME } from '../../config/selectors';
import { configureAvatarUppy } from '../../utils/uppy';
import CropModal from '../common/CropModal';
import StatusBar from '../file/StatusBar';

const AvatarSetting = ({ user }) => {
  const inputRef = useRef();
  const [uppy, setUppy] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [fileSource, setFileSource] = useState(false);
  const [openStatusBar, setOpenStatusBar] = useState(false);
  const { t } = useTranslation(namespaces.account);
  const { mutate: onUploadAvatar } = useMutation(MUTATION_KEYS.UPLOAD_AVATAR);

  const userId = user?.id;

  useEffect(() => {
    setUppy(
      configureAvatarUppy({
        itemId: userId,
        onUpload: () => {
          setOpenStatusBar(true);
        },
        onError: (error) => {
          onUploadAvatar({ id: userId, error });
        },
        onComplete: (result) => {
          // update app on complete
          // todo: improve with websockets or by receiving corresponding items
          if (result?.successful?.length) {
            const data = result.successful[0].response.body;
            onUploadAvatar({ id: userId, data });
          }

          return false;
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
      <Grid
        container
        spacing={3}
        direction="column"
        alignItems="flex-start"
        my={1}
      >
        <Grid item sm={6}>
          <Typography variant="h5">
            {t(ACCOUNT.PROFILE_AVATAR_TITLE)}
          </Typography>
          <Typography variant="body1">
            {t(ACCOUNT.PROFILE_AVATAR_INFORMATION)}
          </Typography>
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
        <Grid item sm={6} xs={12}>
          <Avatar
            id={userId}
            extra={user?.extra}
            alt={t(ACCOUNT.PROFILE_AVATAR_CURRENT_ALT)}
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
  user: PropTypes.instanceOf(Record).isRequired,
};

export default AvatarSetting;

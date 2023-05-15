import Uppy from '@uppy/core';
import { StatusBarProps } from '@uppy/react/src/StatusBar';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useEffect, useRef, useState } from 'react';

import { MemberRecord } from '@graasp/sdk/frontend';
import { ACCOUNT } from '@graasp/translations';

import {
  THUMBNAIL_SETTING_MAX_HEIGHT,
  THUMBNAIL_SETTING_MAX_WIDTH,
} from '../../config/constants';
import { useAccountTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { MEMBER_PROFILE_AVATAR_UPLOAD_BUTTON_CLASSNAME } from '../../config/selectors';
import { configureAvatarUppy } from '../../utils/uppy';
import CropModal, { CropProps } from '../common/CropModal';
import MemberAvatar from '../common/MemberAvatar';
import StatusBar from '../file/StatusBar';

type Props = {
  user: MemberRecord;
};

const AvatarSetting = ({ user }: Props): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>();
  const [uppy, setUppy] = useState<Uppy>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [fileSource, setFileSource] = useState<string>();
  const [openStatusBar, setOpenStatusBar] = useState(false);
  const { t } = useAccountTranslation();
  const { mutate: onUploadAvatar } = mutations.useUploadAvatar();

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
        onFilesAdded: () => null,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!uppy) {
    return null;
  }

  const handleClose: StatusBarProps['handleClose'] = (_event, reason) => {
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

  const onConfirmCrop: CropProps['onConfirm'] = (croppedImage) => {
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
          <MemberAvatar
            maxWidth={THUMBNAIL_SETTING_MAX_WIDTH}
            maxHeight={THUMBNAIL_SETTING_MAX_HEIGHT}
            id={userId}
            component="image"
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

export default AvatarSetting;

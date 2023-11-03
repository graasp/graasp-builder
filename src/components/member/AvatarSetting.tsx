import { FormEventHandler, useEffect, useRef, useState } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { Member } from '@graasp/sdk';
import { ACCOUNT } from '@graasp/translations';

import Uppy from '@uppy/core';

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
  user: Member;
};

const AvatarSetting = ({ user }: Props): JSX.Element | null => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uppy, setUppy] = useState<Uppy>();
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
        onError: (error: Error) => {
          onUploadAvatar({ id: userId, error });
        },
        onComplete: (result: {
          successful: { response: { body: unknown } }[];
        }) => {
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

  const handleClose = () => {
    setOpenStatusBar(false);
  };

  const onSelectFile: FormEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setFileSource(reader.result as string),
      );
      reader.readAsDataURL(target.files[0]);
      setShowCropModal(true);
    }
  };

  const onClose = () => {
    setShowCropModal(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onConfirmCrop: CropProps['onConfirm'] = (croppedImage) => {
    onClose();

    // submit cropped image
    try {
      if (!croppedImage) {
        throw new Error('cropped image is not defined');
      }
      // remove waiting files
      uppy.cancelAll();

      uppy.addFile({
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
      {fileSource && (
        <CropModal
          open={showCropModal}
          onClose={onClose}
          src={fileSource}
          onConfirm={onConfirmCrop}
        />
      )}
    </>
  );
};

export default AvatarSetting;

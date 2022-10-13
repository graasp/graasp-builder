import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { COMMON } from '@graasp/translations';
import { Avatar } from '@graasp/ui';

import { THUMBNAIL_SIZES } from '../../config/constants';
import { hooks } from '../../config/queryClient';
import { buildMemberAvatarClass } from '../../config/selectors';

type Props = {
  id?: string;
};

const MemberAvatar: FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  const { data: member, isLoading, isFetching } = hooks.useMember(id);
  const {
    data: thumbnailBlob,
    isLoading: isLoadingAvatar,
    isFetching: isFetchingAvatar,
  } = hooks.useAvatar({
    id,
    size: THUMBNAIL_SIZES.SMALL,
  });

  return (
    <Avatar
      isLoading={isLoading || isLoadingAvatar || isFetchingAvatar || isFetching}
      className={buildMemberAvatarClass(member?.id)}
      alt={member?.name || t(COMMON.AVATAR_DEFAULT_ALT)}
      component="avatar"
      maxWidth={30}
      maxHeight={30}
      blob={thumbnailBlob}
      sx={{ mx: 1 }}
    />
  );
};

export default MemberAvatar;

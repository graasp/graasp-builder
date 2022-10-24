import { FC } from 'react';

import { COMMON } from '@graasp/translations';
import { Avatar } from '@graasp/ui';

import { AVATAR_ICON_HEIGHT, THUMBNAIL_SIZES } from '../../config/constants';
import { useCommonTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import { buildMemberAvatarClass } from '../../config/selectors';

type Props = {
  id?: string;
};

const MemberAvatar: FC<Props> = ({ id }) => {
  const { t } = useCommonTranslation();
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
      maxWidth={AVATAR_ICON_HEIGHT}
      maxHeight={AVATAR_ICON_HEIGHT}
      blob={thumbnailBlob}
      sx={{ mx: 1 }}
    />
  );
};

export default MemberAvatar;

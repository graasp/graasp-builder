import { FC } from 'react';

import { Avatar } from '@graasp/ui';

import { THUMBNAIL_SIZES } from '../../config/constants';
import { hooks } from '../../config/queryClient';
import { buildMemberAvatarClass } from '../../config/selectors';

type Props = {
  id?: string;
};

const MemberAvatar: FC<Props> = ({ id }) => {
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
      className={buildMemberAvatarClass()}
      alt={member?.name || 'avatar'}
      component="avatar"
      maxWidth={30}
      maxHeight={30}
      blob={thumbnailBlob}
      sx={{ mx: 0.3 }}
    />
  );
};

export default MemberAvatar;

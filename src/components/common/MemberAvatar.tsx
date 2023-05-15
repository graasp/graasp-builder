import { ThumbnailSize } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Avatar } from '@graasp/ui';

import { AVATAR_ICON_HEIGHT } from '../../config/constants';
import { useCommonTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import { buildMemberAvatarClass } from '../../config/selectors';
import defaultImage from '../../resources/avatar.png';

type Props = {
  id?: string;
  maxWidth?: number;
  maxHeight?: number;
  component?: string;
};

const MemberAvatar = ({
  id,
  maxWidth = AVATAR_ICON_HEIGHT,
  maxHeight = AVATAR_ICON_HEIGHT,
  component = 'avatar',
}: Props): JSX.Element => {
  const { t } = useCommonTranslation();
  const { data: member, isLoading } = hooks.useMember(id);
  const { data: avatarUrl, isLoading: isLoadingAvatar } = hooks.useAvatarUrl({
    id,
    size: ThumbnailSize.Small,
  });
  return (
    <Avatar
      url={avatarUrl ?? defaultImage}
      isLoading={isLoading || isLoadingAvatar}
      className={buildMemberAvatarClass(member?.id)}
      alt={member?.name ?? t(COMMON.AVATAR_DEFAULT_ALT)}
      component={component}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      sx={{ mx: 1 }}
    />
  );
};

export default MemberAvatar;

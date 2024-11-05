import { ThumbnailSize } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Avatar } from '@graasp/ui';

import { AVATAR_ICON_HEIGHT } from '../../config/constants';
import { useCommonTranslation } from '../../config/i18n';
import { hooks } from '../../config/queryClient';
import { buildMemberAvatarId } from '../../config/selectors';

type Props = {
  maxWidth?: number;
  maxHeight?: number;
};

export function CurrentMemberAvatar({
  maxWidth = AVATAR_ICON_HEIGHT,
  maxHeight = AVATAR_ICON_HEIGHT,
}: Props): JSX.Element {
  const { t } = useCommonTranslation();
  const { data: member, isLoading } = hooks.useCurrentMember();
  const { data: avatarUrl, isLoading: isLoadingAvatar } = hooks.useAvatarUrl({
    id: member?.id,
    size: ThumbnailSize.Small,
  });
  return (
    <Avatar
      id={buildMemberAvatarId(member?.id)}
      url={avatarUrl}
      isLoading={isLoading || isLoadingAvatar}
      alt={member?.name ?? t(COMMON.AVATAR_DEFAULT_ALT)}
      component="avatar"
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      sx={{ mx: 1 }}
    />
  );
}

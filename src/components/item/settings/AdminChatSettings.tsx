import { Stack, Typography } from '@mui/material';

import { DiscriminatedItem, PermissionLevel } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import { hooks, mutations } from '../../../config/queryClient';
import { ButtonVariants } from '../../../enums';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import ClearChatButton from './ClearChatButton';

type Props = {
  item: DiscriminatedItem;
};

const AdminChatSettings = ({ item }: Props): JSX.Element | null => {
  const itemId = item.id;
  const { t } = useBuilderTranslation();
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    hooks.useItemMemberships(item.id);
  const { data: currentMember } = useCurrentUserContext();
  // only show export chat when user has admin right on the item
  const isAdmin = currentMember
    ? itemPermissions?.find((perms) => perms.member.id === currentMember.id)
        ?.permission === PermissionLevel.Admin
    : false;
  const { mutate: clearChatHook } = mutations.useClearItemChat();

  if (!isAdmin || isLoadingItemPermissions) {
    return null;
  }

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="h6">
        {t(BUILDER.ITEM_SETTINGS_CHAT_SETTINGS_TITLE)}
      </Typography>
      <ClearChatButton
        variant={ButtonVariants.Button}
        chatId={itemId}
        clearChat={clearChatHook}
      />
    </Stack>
  );
};

export default AdminChatSettings;

import { Stack } from '@mui/material';

import { MUTATION_KEYS } from '@graasp/query-client';
import { PermissionLevel } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';

import { hooks, useMutation } from '../../../config/queryClient';
import { ButtonVariants } from '../../../enums/chatbox';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import ClearChatButton from './ClearChatButton';
import DownloadChatButton from './DownloadChatButton';

type Props = {
  item: ItemRecord;
};

const AdminChatSettings = ({ item }: Props): JSX.Element => {
  const itemId = item.id;
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    hooks.useItemMemberships(item.id);
  const { data: currentMember } = useCurrentUserContext();
  // only show export chat when user has admin right on the item
  const isAdmin =
    itemPermissions?.find((perms) => perms.memberId === currentMember.id)
      ?.permission === PermissionLevel.Admin;
  const { mutate: clearChatHook } = useMutation<unknown, unknown, string>(
    MUTATION_KEYS.CLEAR_ITEM_CHAT,
  );

  if (!isAdmin || isLoadingItemPermissions) {
    return null;
  }

  return (
    <Stack direction="column" spacing={1}>
      <DownloadChatButton
        variant={ButtonVariants.BUTTON}
        chatId={itemId}
        showInfo
      />
      <ClearChatButton
        variant={ButtonVariants.BUTTON}
        chatId={itemId}
        clearChat={clearChatHook}
      />
    </Stack>
  );
};

export default AdminChatSettings;

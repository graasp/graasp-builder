import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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

  const downloadChat = (
    <DownloadChatButton variant={ButtonVariants.BUTTON} chatId={itemId} />
  );
  return (
    <Grid container direction="column">
      {downloadChat && (
        <Grid
          item
          xs={12}
          container
          direction="row"
          justifyItems="flex-start"
          alignItems="center"
        >
          <Grid item>{downloadChat}</Grid>
          <Grid item>
            <Typography variant="body1">
              {t('Download the chat to CSV format.')}
            </Typography>
          </Grid>
        </Grid>
      )}
      <Grid
        item
        xs={12}
        container
        direction="row"
        justifyItems="flex-start"
        alignItems="center"
      >
        <Grid item>
          <ClearChatButton
            variant={ButtonVariants.BUTTON}
            chatId={itemId}
            clearChat={clearChatHook}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="body1">
            {t(
              'Careful, this will delete all the messages in this item. Make sure you have a backup (using the button bellow before permanently deleting.',
            )}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminChatSettings;

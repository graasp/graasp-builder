import React, { useContext } from 'react';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Record } from 'immutable';
import { useMutation, hooks } from '../../../config/queryClient';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import { PERMISSION_LEVELS } from '../../../enums';
import ClearChatButton from './ClearChatButton';
import DownloadChatButton from './DownloadChatButton';

const AdminChatSettings = ({ item }) => {
  const { t } = useTranslation();
  const itemId = item.id;
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    hooks.useItemMemberships(item.id);
  const { data: currentMember } = useContext(CurrentUserContext);
  // only show export chat when user has admin right on the item
  const isAdmin =
    itemPermissions?.find((perms) => perms.memberId === currentMember.id)
      ?.permission === PERMISSION_LEVELS.ADMIN;
  const { mutate: clearChatHook } = useMutation(MUTATION_KEYS.CLEAR_ITEM_CHAT);

  if (!isAdmin || isLoadingItemPermissions) {
    return null;
  }

  const downloadChat = <DownloadChatButton variant="button" chatId={itemId} />;
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
            <Typography variant="body">
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
            variant="button"
            chatId={itemId}
            clearChat={clearChatHook}
            exportChat={hooks.useExportItemChat}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="body">
            {t(
              'Careful, this will delete all the messages in this item. Make sure you have a backup (using the button bellow before permanently deleting.',
            )}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

AdminChatSettings.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
};

export default AdminChatSettings;

import clsx from 'clsx';
import { Map, Record } from 'immutable';
import PropTypes from 'prop-types';

import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useContext } from 'react';

import { BUILDER } from '@graasp/translations';
import { ChatboxButton } from '@graasp/ui';

import { ITEM_TYPES_WITH_CAPTIONS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import {
  ITEM_CHATBOX_BUTTON_ID,
  ITEM_INFORMATION_BUTTON_ID,
  ITEM_INFORMATION_ICON_IS_OPEN_CLASS,
  buildEditButtonId,
} from '../../../config/selectors';
import { ITEM_TYPES } from '../../../enums';
import { isItemUpdateAllowedForUser } from '../../../utils/membership';
import AnalyticsDashboardButton from '../../common/AnalyticsDashboardButton';
import PlayerViewButton from '../../common/PlayerViewButton';
import PublishButton from '../../common/PublishButton';
import ShareButton from '../../common/ShareButton';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import { LayoutContext } from '../../context/LayoutContext';
import ItemSettingsButton from '../settings/ItemSettingsButton';
import ModeButton from './ModeButton';

const { useItemMemberships } = hooks;

const ItemHeaderActions = ({ onClickMetadata, onClickChatbox, item }) => {
  const { t } = useBuilderTranslation();
  const {
    setEditingItemId,
    editingItemId,
    isItemSettingsOpen,
    isItemMetadataMenuOpen,
  } = useContext(LayoutContext);
  const id = item?.id;
  const type = item?.type;

  const { data: member } = useContext(CurrentUserContext);

  const { data: memberships } = useItemMemberships(id);
  const canEdit = isItemUpdateAllowedForUser({
    memberships,
    memberId: member?.id,
  });

  const renderItemActions = () => {
    // if id is defined, we are looking at an item
    if (id) {
      // show edition only for allowed types
      const showEditButton =
        !editingItemId && ITEM_TYPES_WITH_CAPTIONS.includes(type) && canEdit;

      const activeActions = (
        <>
          {showEditButton && (
            <Tooltip title={t(BUILDER.EDIT_BUTTON_TOOLTIP)}>
              <IconButton
                aria-label="edit"
                onClick={() => {
                  setEditingItemId(id);
                }}
                id={buildEditButtonId(id)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          <ShareButton itemId={id} />
          <ChatboxButton
            tooltip={t(BUILDER.ITEM_CHATBOX_TITLE)}
            id={ITEM_CHATBOX_BUTTON_ID}
            onClick={onClickChatbox}
          />
          <PlayerViewButton itemId={id} />
          <PublishButton itemId={id} />
          {canEdit && <AnalyticsDashboardButton id={id} />}
        </>
      );

      return (
        <>
          {!isItemSettingsOpen && activeActions}
          {canEdit && <ItemSettingsButton id={id} />}
        </>
      );
    }
    return null;
  };

  const renderTableActions = () => {
    // show only for content with tables : root or folders
    if (type === ITEM_TYPES.FOLDER || !id) {
      return <ModeButton />;
    }
    return null;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {renderItemActions()}
      {renderTableActions()}
      {id && (
        <Tooltip title={t(BUILDER.ITEM_METADATA_TITLE)}>
          <IconButton
            id={ITEM_INFORMATION_BUTTON_ID}
            onClick={onClickMetadata}
            className={clsx({
              [ITEM_INFORMATION_ICON_IS_OPEN_CLASS]: isItemMetadataMenuOpen,
            })}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

ItemHeaderActions.propTypes = {
  onClickMetadata: PropTypes.func,
  onClickChatbox: PropTypes.func,
  item: PropTypes.instanceOf(Record),
};

ItemHeaderActions.defaultProps = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClickMetadata: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClickChatbox: () => {},
  item: Map(),
};

export default ItemHeaderActions;

import React, { useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import EditIcon from '@material-ui/icons/Edit';
import { Map } from 'immutable';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
import ForumIcon from '@material-ui/icons/Forum';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import ModeButton from './ModeButton';
import { ITEM_TYPES } from '../../../enums';
import { LayoutContext } from '../../context/LayoutContext';
import {
  buildEditButtonId,
  ITEM_CHATBOX_BUTTON_ID,
  ITEM_INFORMATION_BUTTON_ID,
  ITEM_INFORMATION_ICON_IS_OPEN_CLASS,
} from '../../../config/selectors';
import ShareButton from '../../common/ShareButton';
import { ITEM_TYPES_WITH_CAPTIONS } from '../../../config/constants';
import ItemSettingsButton from '../settings/ItemSettingsButton';
import PerformViewButton from '../../common/PerformViewButton';
import {
  getMembership,
  isItemUpdateAllowedForUser,
} from '../../../utils/membership';
import { hooks } from '../../../config/queryClient';
import { CurrentUserContext } from '../../context/CurrentUserContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  buttons: {
    display: 'flex',
  },
}));

const { useItemMemberships } = hooks;

const ItemHeaderActions = ({ onClickMetadata, onClickChatbox, item }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    setEditingItemId,
    editingItemId,
    isItemSettingsOpen,
    isItemMetadataMenuOpen,
  } = useContext(LayoutContext);
  const id = item?.get('id');
  const type = item?.get('type');

  const { data: member } = useContext(CurrentUserContext);

  const { data: memberships } = useItemMemberships([id]);
  const canEdit = isItemUpdateAllowedForUser({
    memberships: getMembership(memberships),
    memberId: member?.get('id'),
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
            <Tooltip title={t('Edit')}>
              <IconButton
                aria-label="edit"
                onClick={() => {
                  setEditingItemId(id);
                }}
                id={buildEditButtonId(id)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <ShareButton itemId={id} />
          <PerformViewButton itemId={id} />
          <IconButton id={ITEM_CHATBOX_BUTTON_ID} onClick={onClickChatbox}>
            <ForumIcon />
          </IconButton>
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
    <div className={classes.buttons}>
      {renderItemActions()}
      {renderTableActions()}
      {id && (
        <>
          <IconButton
            id={ITEM_INFORMATION_BUTTON_ID}
            onClick={onClickMetadata}
            className={clsx({
              [ITEM_INFORMATION_ICON_IS_OPEN_CLASS]: isItemMetadataMenuOpen,
            })}
          >
            <InfoIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};

ItemHeaderActions.propTypes = {
  onClickMetadata: PropTypes.func,
  onClickChatbox: PropTypes.func,
  item: PropTypes.instanceOf(Map),
};

ItemHeaderActions.defaultProps = {
  onClickMetadata: () => {},
  onClickChatbox: () => {},
  item: Map(),
};

export default ItemHeaderActions;

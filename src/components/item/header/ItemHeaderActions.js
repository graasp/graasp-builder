import React, { useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import EditIcon from '@material-ui/icons/Edit';
import { Map } from 'immutable';
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from '@material-ui/core/styles';
import ModeButton from './ModeButton';
import { ITEM_TYPES } from '../../../enums';
import { LayoutContext } from '../../context/LayoutContext';
import {
  ITEM_INFORMATION_BUTTON_ID,
  ITEM_INFORMATION_ICON_IS_OPEN_CLASS,
  VIEW_ITEM_EDIT_ITEM_BUTTON_ID,
} from '../../../config/selectors';
import ShareButton from '../../common/ShareButton';
import { ITEM_TYPES_WITH_CAPTIONS } from '../../../config/constants';
import ItemSettingsButton from '../settings/ItemSettingsButton';

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
const ItemHeaderActions = ({ onClick, item }) => {
  const classes = useStyles();
  const {
    setEditingItemId,
    editingItemId,
    isItemSettingsOpen,
    isItemMetadataMenuOpen,
  } = useContext(LayoutContext);
  const id = item?.get('id');
  const type = item?.get('type');

  const renderItemActions = () => {
    // if id is defined, we are looking at an item
    if (id) {
      // show edition only for allowed types
      const showEditButton =
        !editingItemId && ITEM_TYPES_WITH_CAPTIONS.includes(type);

      const activeActions = (
        <>
          {showEditButton && (
            <IconButton
              aria-label="edit"
              onClick={() => {
                setEditingItemId(id);
              }}
              id={VIEW_ITEM_EDIT_ITEM_BUTTON_ID}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          <ShareButton itemId={id} />
        </>
      );

      return (
        <>
          {!isItemSettingsOpen && activeActions}
          <ItemSettingsButton id={id} />
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
        <IconButton
          id={ITEM_INFORMATION_BUTTON_ID}
          onClick={onClick}
          className={clsx({
            [ITEM_INFORMATION_ICON_IS_OPEN_CLASS]: isItemMetadataMenuOpen,
          })}
        >
          <InfoIcon />
        </IconButton>
      )}
    </div>
  );
};

ItemHeaderActions.propTypes = {
  onClick: PropTypes.func,
  item: PropTypes.instanceOf(Map).isRequired,
};

ItemHeaderActions.defaultProps = {
  onClick: () => {},
};

export default ItemHeaderActions;

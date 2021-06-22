import React, { useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import { Map } from 'immutable';
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from '@material-ui/core/styles';
import ModeButton from './ModeButton';
import { ITEM_TYPES } from '../../../enums';
import DeleteButton from '../../common/DeleteButton';
import { ItemLayoutModeContext } from '../../context/ItemLayoutModeContext';
import { VIEW_ITEM_EDIT_ITEM_BUTTON_ID } from '../../../config/selectors';
import ShareButton from '../../common/ShareButton';
import { ITEM_TYPES_WITH_CAPTIONS } from '../../../config/constants';

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
  const type = item?.get('type');
  const isFile = type && type !== ITEM_TYPES.FOLDER;
  const id = item?.get('id');
  const { setEditingItemId, editingItemId } = useContext(ItemLayoutModeContext);
  const hasCaption = ITEM_TYPES_WITH_CAPTIONS.includes(type);

  /* todo: factor edit button */
  const actions = isFile && !editingItemId && hasCaption && (
    <IconButton
      aria-label="edit"
      onClick={() => {
        setEditingItemId(id);
      }}
      id={VIEW_ITEM_EDIT_ITEM_BUTTON_ID}
    >
      <EditIcon fontSize="small" />
    </IconButton>
  );

  return (
    <div className={classes.buttons}>
      {actions}
      {!isFile && <ModeButton />}
      {id && (
        <>
          <ShareButton itemId={id} />
          <DeleteButton itemIds={[id]} />
          <IconButton onClick={onClick} color="primary">
            <InfoIcon color="primary" />
          </IconButton>
        </>
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

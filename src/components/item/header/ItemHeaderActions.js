import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import { makeStyles } from '@material-ui/core/styles';
import ModeButton from './ModeButton';
import { ITEM_TYPES } from '../../../config/constants';

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
const ItemHeaderActions = ({ onClick, itemType, id }) => {
  const isFile = itemType && itemType !== ITEM_TYPES.FOLDER;

  const classes = useStyles();
  return (
    <div className={classes.buttons}>
      {!isFile && <ModeButton />}
      {id && (
        <IconButton onClick={onClick} color="primary">
          <InfoIcon color="primary" />
        </IconButton>
      )}
    </div>
  );
};

ItemHeaderActions.propTypes = {
  onClick: PropTypes.func,
  itemType: PropTypes.oneOf(Object.values(ITEM_TYPES)).isRequired,
  id: PropTypes.string,
};

ItemHeaderActions.defaultProps = {
  onClick: () => {},
  id: null,
};

export default ItemHeaderActions;

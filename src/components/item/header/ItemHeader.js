import React from 'react';
import PropTypes from 'prop-types';
import { useMatch } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { hooks } from '../../../config/queryClient';
import Navigation from '../../layout/Navigation';
import ItemHeaderActions from './ItemHeaderActions';
import { buildItemPath } from '../../../config/paths';
import Loader from '../../common/Loader';
import { ITEM_HEADER_ID } from '../../../config/selectors';

const { useItem } = hooks;

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

const ItemHeader = ({ onClickMetadata, onClickChatbox, showNavigation }) => {
  const match = useMatch(buildItemPath());
  const itemId = match?.params?.itemId;
  const { data: item, isLoading: isItemLoading } = useItem(itemId);
  const classes = useStyles();

  if (isItemLoading) {
    return <Loader />;
  }

  return (
    <div className={classes.root} id={ITEM_HEADER_ID}>
      {/* display empty div to render actions on the right */}
      {showNavigation ? <Navigation /> : <div />}
      <ItemHeaderActions
        item={item}
        onClickChatbox={onClickChatbox}
        onClickMetadata={onClickMetadata}
      />
    </div>
  );
};

ItemHeader.propTypes = {
  onClickMetadata: PropTypes.func,
  onClickChatbox: PropTypes.func,
  showNavigation: PropTypes.bool,
};

ItemHeader.defaultProps = {
  onClickMetadata: () => {},
  onClickChatbox: () => {},
  showNavigation: true,
};

export default ItemHeader;

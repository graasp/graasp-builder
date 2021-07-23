import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';
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

const ItemHeader = ({ onClick }) => {
  const match = useRouteMatch(buildItemPath());
  const itemId = match?.params?.itemId;
  const { data: item, isLoading: isItemLoading } = useItem(itemId);
  const classes = useStyles();

  if (isItemLoading) {
    return <Loader />;
  }

  return (
    <div className={classes.root} id={ITEM_HEADER_ID}>
      <Navigation />
      <ItemHeaderActions item={item} onClick={onClick} />
    </div>
  );
};

ItemHeader.propTypes = {
  onClick: PropTypes.func,
};

ItemHeader.defaultProps = {
  onClick: () => {},
};

export default ItemHeader;

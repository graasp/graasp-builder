import React from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Navigation from '../../layout/Navigation';
import ItemHeaderActions from './ItemHeaderActions';

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

const ItemHeader = ({ onClick, item, user }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Navigation item={item} user={user} />
      <ItemHeaderActions
        id={item.get('id')}
        itemType={item.get('type')}
        onClick={onClick}
      />
    </div>
  );
};

const mapStateToProps = ({ item, member }) => ({
  item: item.get('item'),
  user: member.get('current'),
});

ItemHeader.propTypes = {
  onClick: PropTypes.func,
  item: PropTypes.instanceOf(Map).isRequired,
  user: PropTypes.instanceOf(Map).isRequired,
};

ItemHeader.defaultProps = {
  onClick: () => {},
};

const ConnectedComponent = connect(mapStateToProps)(ItemHeader);

export default ConnectedComponent;

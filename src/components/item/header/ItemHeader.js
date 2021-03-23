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

const ItemHeader = ({ navigationRootText, onClick, item }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Navigation item={item} rootText={navigationRootText} />
      <ItemHeaderActions
        id={item.get('id')}
        itemType={item.get('type')}
        onClick={onClick}
      />
    </div>
  );
};

const mapStateToProps = ({ item }) => ({
  item: item.get('item'),
});

ItemHeader.propTypes = {
  navigationRootText: PropTypes.string,
  onClick: PropTypes.func,
  item: PropTypes.instanceOf(Map).isRequired,
};

ItemHeader.defaultProps = {
  navigationRootText: null,
  onClick: () => {},
};

const ConnectedComponent = connect(mapStateToProps)(ItemHeader);

export default ConnectedComponent;

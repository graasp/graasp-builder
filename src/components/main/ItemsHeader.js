import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Navigation from '../layout/Navigation';
import ModeButton from './ModeButton';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
}));

const ItemsHeader = ({ navigationRootText }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Navigation rootText={navigationRootText} />
      <ModeButton />
    </div>
  );
};

ItemsHeader.propTypes = {
  navigationRootText: PropTypes.string,
};

ItemsHeader.defaultProps = {
  navigationRootText: null,
};

export default ItemsHeader;

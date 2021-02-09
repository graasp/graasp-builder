import React from 'react';
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

const ItemsHeader = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Navigation />
      <ModeButton />
    </div>
  );
};

export default ItemsHeader;

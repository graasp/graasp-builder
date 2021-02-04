import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Navigation from '../layout/Navigation';
import ModeButtons from './ModeButtons';

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
      <ModeButtons />
    </div>
  );
};

export default ItemsHeader;

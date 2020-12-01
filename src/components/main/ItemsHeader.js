import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Info from '@material-ui/icons/Info';

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
      <Typography variant="h5">Items</Typography>
      <Tooltip title="These are your items" placement="left">
        <Info color="primary" fontSize="small" />
      </Tooltip>
    </div>
  );
};

export default ItemsHeader;

import React from 'react';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles(() => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

function ItemPanelHeader({ title, onClick }) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.drawerHeader}>
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClick}>
          <ChevronRightIcon />
        </IconButton>
      </div>
      <Divider />
    </>
  );
}
ItemPanelHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ItemPanelHeader;

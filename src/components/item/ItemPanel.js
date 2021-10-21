import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import { Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { RIGHT_MENU_WIDTH } from '../../config/constants';
import { ITEM_PANEL_ID } from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: RIGHT_MENU_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: RIGHT_MENU_WIDTH,
    padding: theme.spacing(1),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));

const ItemPanel = ({ open, children }) => {
  const classes = useStyles();

  return (
    <Drawer
      id={ITEM_PANEL_ID}
      anchor="right"
      variant="persistent"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      open={open}
    >
      <Toolbar />
      {children}
    </Drawer>
  );
};

ItemPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.element,
};

ItemPanel.defaultProps = {
  children: null,
};

export default ItemPanel;

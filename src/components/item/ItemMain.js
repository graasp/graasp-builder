import React, { useState } from 'react';
import { Map } from 'immutable';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { RIGHT_MENU_WIDTH } from '../../config/constants';
import ItemHeader from './header/ItemHeader';
import ItemPanel from './ItemPanel';

const useStyles = makeStyles((theme) => ({
  root: {},
  menuButton: {},
  hide: {
    display: 'none',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    position: 'relative',
    padding: theme.spacing(1),
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: 0,
    // takes the whole screen height minus the header height approximatively
    // this might have to change
    minHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: RIGHT_MENU_WIDTH,
  },
}));

const ItemMain = ({ children, item }) => {
  const classes = useStyles();
  const [metadataMenuOpen, setMetadataMenuOpen] = useState(true);

  const handleToggleMetadataMenu = () => {
    setMetadataMenuOpen(!metadataMenuOpen);
  };

  return (
    <>
      <ItemPanel item={item} open={metadataMenuOpen} />
      <div
        className={clsx(classes.root, classes.content, {
          [classes.contentShift]: metadataMenuOpen,
        })}
      >
        <ItemHeader onClick={handleToggleMetadataMenu} />

        {children}
      </div>
    </>
  );
};

ItemMain.propTypes = {
  children: PropTypes.node.isRequired,
  item: PropTypes.instanceOf(Map).isRequired,
};

export default ItemMain;

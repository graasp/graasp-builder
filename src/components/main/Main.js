import React, { useContext } from 'react';
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import PropTypes from 'prop-types';
import { HEADER_HEIGHT, LEFT_MENU_WIDTH } from '../../config/constants';
import MainMenu from './MainMenu';
import Header from '../layout/Header';
import { LayoutContext } from '../context/LayoutContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  menuButton: {},
  hide: {
    display: 'none',
  },
  drawer: {
    width: LEFT_MENU_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: LEFT_MENU_WIDTH,
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
    marginLeft: -LEFT_MENU_WIDTH,
    height: '100vh',
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  appBarBlank: {
    height: HEADER_HEIGHT,
  },
}));

const Main = ({ children }) => {
  const classes = useStyles();

  const { isMainMenuOpen, setIsMainMenuOpen } = useContext(LayoutContext);

  const toggleDrawer = (isOpen) => {
    setIsMainMenuOpen(isOpen);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header toggleMenu={toggleDrawer} isMenuOpen={isMainMenuOpen} />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        open={isMainMenuOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.appBarBlank} />
        <div role="presentation" className={classes.list}>
          <MainMenu />
        </div>
      </Drawer>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: isMainMenuOpen,
        })}
      >
        <div className={classes.appBarBlank} />
        {children}
      </main>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Main;

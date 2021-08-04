import React, { useContext } from 'react';
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { Loader } from '@graasp/ui';
import { useLocation } from 'react-router';
import {
  HEADER_HEIGHT,
  LEFT_GROUP_MENU_WIDTH,
  LEFT_MENU_WIDTH,
} from '../../config/constants';
import MainMenu from './MainMenu';
import Header from '../layout/Header';
import { LayoutContext } from '../context/LayoutContext';
import MainGroupMenu from './MainGroupMenu';
import { hooks } from '../../config/queryClient';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginLeft: LEFT_GROUP_MENU_WIDTH,
  },
  menuButton: {},
  hide: {
    display: 'none',
  },
  drawer: {
    width: LEFT_MENU_WIDTH,
    left: LEFT_MENU_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: LEFT_MENU_WIDTH,
    position: 'relative',
    zIndex: 1,
  },
  groupPanel: {
    width: LEFT_GROUP_MENU_WIDTH,
    flexShrink: 0,
    zIndex: 100,
    position: 'fixed',
    height: '100%',
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
  const {
    data: rootGroups,
    isLoading: isRootGroupsLoading,
  } = hooks.useRootGroups();

  const { pathname } = useLocation();

  const regex = /^\/group\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/;
  let groupId;

  if (regex.test(pathname)) {
    const match = pathname.match(regex);
    groupId = match['1'];
  }

  if (isRootGroupsLoading) {
    return <Loader />;
  }

  return (
    <Box display="flex" bgcolor="background.paper">
      <Box className={classes.groupPanel} bgcolor="rgb(209 209 218)">
        <MainGroupMenu groups={rootGroups} />
      </Box>
      <Box flexGrow={1}>
        <div className={classes.root}>
          <CssBaseline />
          <Header
            className={classes.header}
            toggleMenu={toggleDrawer}
            isMenuOpen={isMainMenuOpen}
          />
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
              <MainMenu groupId={groupId} />
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
      </Box>
    </Box>
  );
};

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Main;

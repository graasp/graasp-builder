import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import IconButton from '@material-ui/core/IconButton';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { ReactComponent as GraaspLogo } from '../../resources/graasp-logo.svg';
import { APP_NAME, HEADER_HEIGHT } from '../../config/constants';
import SettingsHeader from '../common/SettingsHeader';
import { HEADER_APP_BAR_ID } from '../../config/selectors';
import { HOME_PATH } from '../../config/paths';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: theme.zIndex.drawer + 1,
  },
  headerLeft: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    height: '40px',
    margin: theme.spacing(0, 2),
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
  },
  appBarBlank: {
    height: HEADER_HEIGHT,
  },
}));

const Header = ({ isMenuOpen, toggleMenu }) => {
  const classes = useStyles();

  const renderMenuIcon = () => {
    if (isMenuOpen) {
      return (
        <IconButton onClick={() => toggleMenu(false)} color="inherit">
          <MenuOpenIcon />
        </IconButton>
      );
    }
    return (
      <IconButton onClick={() => toggleMenu(true)} color="inherit">
        <MenuIcon />
      </IconButton>
    );
  };

  return (
    <AppBar position="fixed" id={HEADER_APP_BAR_ID}>
      <Toolbar className={classes.header}>
        <div className={classes.headerLeft}>
          {renderMenuIcon()}
          <Link to={HOME_PATH} className={classes.link}>
            <GraaspLogo className={classes.logo} />
            <Typography variant="h6" color="inherit">
              {APP_NAME}
            </Typography>
          </Link>
        </div>
        <SettingsHeader />
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
};

export default Header;

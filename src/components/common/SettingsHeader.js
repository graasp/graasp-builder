import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { grey } from '@material-ui/core/colors';
import Menu from '@material-ui/core/Menu';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';
import truncate from 'lodash.truncate';
import MenuItem from '@material-ui/core/MenuItem';
import { signOut } from '../../actions';
import {
  AUTHENTICATION_HOST,
  USERNAME_MAX_LENGTH,
} from '../../config/constants';
import { buildSignInPath } from '../../api/routes';
import {
  HEADER_USER_ID,
  USER_MENU_SIGN_OUT_OPTION_ID,
} from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  avatar: {
    backgroundColor: grey[0],
  },
  username: {
    margin: theme.spacing(0, 2),
    maxWidth: 100,
  },
}));

function SettingsHeader() {
  const user = useSelector(({ member }) => member.getIn(['current']));
  const classes = useStyles();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    dispatch(signOut());
    handleClose();
  };

  const handleSignIn = () => {
    window.location.url = `${AUTHENTICATION_HOST}/${buildSignInPath()}`;
  };

  const renderMenu = () => {
    if (user.isEmpty()) {
      return <MenuItem onClick={handleSignIn}>{t('Sign In')}</MenuItem>;
    }

    return (
      <MenuItem onClick={handleSignOut} id={USER_MENU_SIGN_OUT_OPTION_ID}>
        {t('Sign Out')}
      </MenuItem>
    );
  };

  const username = user.get('name');
  // todo: necessary broken image to display a letter
  const avatarImage = 'a missing avatar';

  return (
    <>
      <Box
        className={classes.wrapper}
        onClick={handleClick}
        id={HEADER_USER_ID}
      >
        <Avatar className={classes.avatar} alt={username} src={avatarImage} />
        {username && (
          <Typography variant="subtitle1" className={classes.username}>
            {truncate(username, { length: USERNAME_MAX_LENGTH })}
          </Typography>
        )}
      </Box>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {renderMenu()}
      </Menu>
    </>
  );
}

export default SettingsHeader;

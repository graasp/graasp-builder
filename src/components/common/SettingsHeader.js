import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import truncate from 'lodash.truncate';
import { redirect } from '@graasp/utils';
import { Avatar } from '@graasp/ui';
import { MUTATION_KEYS, API_ROUTES } from '@graasp/query-client';
import MenuItem from '@material-ui/core/MenuItem';
import { useMutation, hooks } from '../../config/queryClient';
import {
  AUTHENTICATION_HOST,
  USERNAME_MAX_LENGTH,
  HEADER_USERNAME_MAX_WIDTH,
  SIGN_IN_LINK,
} from '../../config/constants';
import {
  HEADER_USER_ID,
  USER_MENU_SIGN_OUT_OPTION_ID,
} from '../../config/selectors';
import Loader from './Loader';
import { MEMBER_PROFILE_PATH } from '../../config/paths';
import { CurrentUserContext } from '../context/CurrentUserContext';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  username: {
    margin: theme.spacing(0, 2),
    maxWidth: HEADER_USERNAME_MAX_WIDTH,
  },
}));

const SettingsHeader = () => {
  const { data: user, isLoading } = useContext(CurrentUserContext);
  const classes = useStyles();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { mutate: signOut, isSuccess: isSignOuSuccess } = useMutation(
    MUTATION_KEYS.SIGN_OUT,
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isSignOuSuccess) {
    redirect(SIGN_IN_LINK);
  }

  const username = user?.get('name');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    handleClose();
  };

  const goToProfile = () => {
    navigate(MEMBER_PROFILE_PATH);
  };

  const renderMenu = () => {
    const isSignedOut = !user || user.isEmpty();

    if (isSignedOut) {
      return (
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            component="a"
            href={`${AUTHENTICATION_HOST}/${API_ROUTES.SIGN_IN_ROUTE}`}
          >
            {t('Sign In')}
          </MenuItem>
        </Menu>
      );
    }

    return (
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={goToProfile}>{t('Profile')}</MenuItem>
        <MenuItem onClick={handleSignOut} id={USER_MENU_SIGN_OUT_OPTION_ID}>
          {t('Sign Out')}
        </MenuItem>
      </Menu>
    );
  };

  return (
    <>
      <Box
        className={classes.wrapper}
        onClick={handleClick}
        id={HEADER_USER_ID}
      >
        <Tooltip title={username ?? t('You are not signed in.')}>
          <Avatar
            id={user?.get('id')}
            extra={user?.get('extra')}
            maxWidth={30}
            maxHeight={30}
            variant="circle"
            alt={username}
            component="avatar"
            useAvatar={hooks.useAvatar}
          />
        </Tooltip>
        {username && (
          <Typography variant="subtitle1" className={classes.username}>
            {truncate(username, { length: USERNAME_MAX_LENGTH })}
          </Typography>
        )}
      </Box>
      {renderMenu()}
    </>
  );
};

export default SettingsHeader;

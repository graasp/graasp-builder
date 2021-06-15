import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import truncate from 'lodash.truncate';
import { MUTATION_KEYS, API_ROUTES } from '@graasp/query-client';
import MenuItem from '@material-ui/core/MenuItem';
import { hooks, useMutation } from '../../config/queryClient';
import {
  AUTHENTICATION_HOST,
  USERNAME_MAX_LENGTH,
} from '../../config/constants';
import {
  HEADER_USER_ID,
  USER_MENU_SIGN_OUT_OPTION_ID,
} from '../../config/selectors';
import Loader from './Loader';
import { MEMBER_PROFILE_PATH } from '../../config/paths';

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
    maxWidth: 100,
  },
}));

const SettingsHeader = () => {
  const { data: user, isLoading } = hooks.useCurrentMember();
  const classes = useStyles();
  const { push } = useHistory();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { mutate: signOut } = useMutation(MUTATION_KEYS.SIGN_OUT);

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
    push(MEMBER_PROFILE_PATH);
  };

  const renderMenu = () => {
    if (!user || user.isEmpty()) {
      return (
        <MenuItem
          component="a"
          href={`${AUTHENTICATION_HOST}/${API_ROUTES.buildSignInPath()}`}
        >
          {t('Sign In')}
        </MenuItem>
      );
    }

    return (
      <>
        <MenuItem onClick={goToProfile}>{t('Profile')}</MenuItem>
        <MenuItem onClick={handleSignOut} id={USER_MENU_SIGN_OUT_OPTION_ID}>
          {t('Sign Out')}
        </MenuItem>
      </>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  const username = user?.get('name');
  // todo: necessary broken image to display a letter
  const avatarImage = 'a missing avatar';

  return (
    <>
      <Box
        className={classes.wrapper}
        onClick={handleClick}
        id={HEADER_USER_ID}
      >
        <Tooltip title={username ?? t('You are not signed in.')}>
          <Avatar className={classes.avatar} alt={username} src={avatarImage} />
        </Tooltip>
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
};

export default SettingsHeader;

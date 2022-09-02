import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import IconButton from '@material-ui/core/IconButton';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { GraaspLogo, Navigation } from '@graasp/ui';
import { MentionButton } from '@graasp/chatbox';
import { useMutation } from 'react-query';
import { MUTATION_KEYS } from '@graasp/query-client';
import { Context } from '@graasp/sdk';
import {
  APP_NAME,
  GRAASP_LOGO_HEADER_HEIGHT,
  HEADER_HEIGHT,
  HOST_MAP,
} from '../../config/constants';
import UserSwitchWrapper from '../common/UserSwitchWrapper';
import {
  APP_NAVIGATION_DROP_DOWN_ID,
  HEADER_APP_BAR_ID,
} from '../../config/selectors';
import { HOME_PATH } from '../../config/paths';
import { hooks } from '../../config/queryClient';

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
  headerRight: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fill: 'white',
  },
  title: {
    margin: theme.spacing(0, 2, 0, 1),
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

  const { data: currentMember } = hooks.useCurrentMember();
  const memberId = currentMember?.get('id');
  // mutations to handle the mentions
  const { mutate: patchMentionMutate } = useMutation(
    MUTATION_KEYS.PATCH_MENTION,
  );
  const patchMentionFunction = ({ id, status }) =>
    patchMentionMutate({ memberId, id, status });
  const { mutate: deleteMentionMutate } = useMutation(
    MUTATION_KEYS.DELETE_MENTION,
  );
  const deleteMentionFunction = (mentionId) =>
    deleteMentionMutate({ memberId, mentionId });
  const { mutate: clearAllMentionsMutate } = useMutation(
    MUTATION_KEYS.CLEAR_MENTIONS,
  );
  const clearAllMentionsFunction = () => clearAllMentionsMutate({ memberId });

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
            <GraaspLogo
              height={GRAASP_LOGO_HEADER_HEIGHT}
              className={classes.logo}
            />
            <Typography variant="h6" color="inherit" className={classes.title}>
              {APP_NAME}
            </Typography>
          </Link>
          <Navigation
            id={APP_NAVIGATION_DROP_DOWN_ID}
            hostMap={HOST_MAP}
            currentValue={Context.BUILDER}
          />
        </div>
        <div className={classes.headerRight}>
          <MentionButton
            color="secondary"
            useMentions={hooks.useMentions}
            useMembers={hooks.useMembers}
            patchMentionFunction={patchMentionFunction}
            deleteMentionFunction={deleteMentionFunction}
            clearAllMentionsFunction={clearAllMentionsFunction}
          />
          <UserSwitchWrapper />
        </div>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
};

export default Header;

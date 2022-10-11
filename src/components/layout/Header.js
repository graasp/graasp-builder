import PropTypes from 'prop-types';

import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Typography, styled } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { Link } from 'react-router-dom';

// import { MentionButton } from '@graasp/chatbox';
import { MUTATION_KEYS } from '@graasp/query-client';
import { Context } from '@graasp/sdk';
import { Header as GraaspHeader, GraaspLogo, Navigation } from '@graasp/ui';

import {
  APP_NAME,
  GRAASP_LOGO_HEADER_HEIGHT,
  HEADER_HEIGHT,
  HOST_MAP,
} from '../../config/constants';
import { HOME_PATH } from '../../config/paths';
import { hooks, useMutation } from '../../config/queryClient';
import {
  APP_NAVIGATION_DROP_DOWN_ID,
  HEADER_APP_BAR_ID,
} from '../../config/selectors';
import UserSwitchWrapper from '../common/UserSwitchWrapper';

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
}));

const Header = ({ isMenuOpen, toggleMenu }) => {
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

  const leftContent = (
    <Box display="flex" ml={2}>
      {renderMenuIcon()}
      <StyledLink to={HOME_PATH}>
        <GraaspLogo height={GRAASP_LOGO_HEADER_HEIGHT} sx={{ fill: 'white' }} />
        <Typography variant="h6" color="inherit" mr={2} ml={1}>
          {APP_NAME}
        </Typography>
      </StyledLink>
      <Navigation
        id={APP_NAVIGATION_DROP_DOWN_ID}
        hostMap={HOST_MAP}
        currentValue={Context.BUILDER}
      />
    </Box>
  );

  const rightContent = (
    <>
      {/* <MentionButton
  color="secondary"
  useMentions={hooks.useMentions}
  useMembers={hooks.useMembers}
  patchMentionFunction={patchMentionFunction}
  deleteMentionFunction={deleteMentionFunction}
  clearAllMentionsFunction={clearAllMentionsFunction}
/> */}
      <UserSwitchWrapper />
    </>
  );

  return <GraaspHeader leftContent={leftContent} rightContent={rightContent} />;
};

Header.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
};

export default Header;

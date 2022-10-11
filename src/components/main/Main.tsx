import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Typography, styled } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { FC, useContext } from 'react';
import { Link } from 'react-router-dom';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Context } from '@graasp/sdk';
import { GraaspLogo, Main as GraaspMain, Navigation } from '@graasp/ui';

// import { MentionButton } from '@graasp/chatbox';
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
import CookiesBanner from '../common/CookiesBanner';
import UserSwitchWrapper from '../common/UserSwitchWrapper';
import { LayoutContext } from '../context/LayoutContext';
import MainMenu from './MainMenu';

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
}));
type Props = { children: JSX.Element };

const Main: FC<Props> = ({ children }) => {
  const { isMainMenuOpen, setIsMainMenuOpen } = useContext(LayoutContext);
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

  const toggleDrawer = (isOpen: boolean) => {
    setIsMainMenuOpen(isOpen);
  };

  const leftContent = (
    <Box display="flex" ml={2}>
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

  return (
    <GraaspMain
      headerLeftContent={leftContent}
      headerRightContent={rightContent}
      sidebar={<MainMenu />}
      open={isMainMenuOpen}
    >
      <CookiesBanner />
      {/* <Header toggleMenu={toggleDrawer} isMenuOpen={isMainMenuOpen} /> */}
      {children}
    </GraaspMain>
  );
};

export default Main;

import { Grid, Typography, styled } from '@mui/material';
import Box from '@mui/material/Box';

import { FC, useContext } from 'react';
import { Link } from 'react-router-dom';

import { MentionButton } from '@graasp/chatbox';
import { MUTATION_KEYS } from '@graasp/query-client';
import { Context } from '@graasp/sdk';
import { GraaspLogo, Main as GraaspMain, Navigation } from '@graasp/ui';

import {
  APP_NAME,
  GRAASP_LOGO_HEADER_HEIGHT,
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
type Props = { children: JSX.Element | (JSX.Element & string) };

const Main: FC<Props> = ({ children }) => {
  const { isMainMenuOpen } = useContext(LayoutContext);
  const { data: currentMember } = hooks.useCurrentMember();
  const memberId = currentMember?.get('id');
  // mutations to handle the mentions
  const { mutate: patchMentionMutate } = useMutation<any, any, any>(
    MUTATION_KEYS.PATCH_MENTION,
  );
  const patchMentionFunction = ({
    id,
    status,
  }: {
    id: string;
    status: string;
  }) => patchMentionMutate({ memberId, id, status });
  const { mutate: deleteMentionMutate } = useMutation<any, any, any>(
    MUTATION_KEYS.DELETE_MENTION,
  );
  const deleteMentionFunction = (mentionId: string) =>
    deleteMentionMutate({ memberId, mentionId });
  const { mutate: clearAllMentionsMutate } = useMutation<any, any, any>(
    MUTATION_KEYS.CLEAR_MENTIONS,
  );
  const clearAllMentionsFunction = () => clearAllMentionsMutate({ memberId });

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
    <Grid container>
      <Grid item>
        <MentionButton
          color="secondary"
          useMentions={hooks.useMentions}
          useMembers={hooks.useMembers}
          patchMentionFunction={patchMentionFunction}
          deleteMentionFunction={deleteMentionFunction}
          clearAllMentionsFunction={clearAllMentionsFunction}
        />
      </Grid>
      <Grid item>
        <UserSwitchWrapper />
      </Grid>
    </Grid>
  );

  return (
    <GraaspMain
      headerId={HEADER_APP_BAR_ID}
      headerLeftContent={leftContent}
      headerRightContent={rightContent}
      sidebar={<MainMenu />}
      open={isMainMenuOpen}
    >
      <CookiesBanner />
      {children}
    </GraaspMain>
  );
};

export default Main;

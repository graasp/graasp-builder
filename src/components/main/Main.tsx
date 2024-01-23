import { Link } from 'react-router-dom';

import { Grid, Typography, styled } from '@mui/material';
import Box from '@mui/material/Box';

import { Context } from '@graasp/sdk';
import {
  GraaspLogo,
  Main as GraaspMain,
  Platform,
  PlatformSwitch,
  defaultHostsMapper,
  useMobileView,
  usePlatformNavigation,
  useShortenURLParams,
} from '@graasp/ui';

import { HOST_MAP } from '@/config/externalPaths';

import { APP_NAME, GRAASP_LOGO_HEADER_HEIGHT } from '../../config/constants';
import { HOME_PATH, ITEM_ID_PARAMS } from '../../config/paths';
import {
  APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS,
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
  HEADER_APP_BAR_ID,
} from '../../config/selectors';
import CookiesBanner from '../common/CookiesBanner';
import UserSwitchWrapper from '../common/UserSwitchWrapper';
import { useLayoutContext } from '../context/LayoutContext';
import MainMenu from './MainMenu';
import NotificationButton from './NotificationButton';

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
}));
type Props = { children: JSX.Element | (JSX.Element & string) };

// small converter for HOST_MAP into a usePlatformNavigation mapper
export const platformsHostsMap = defaultHostsMapper({
  [Platform.Player]: HOST_MAP.player,
  [Platform.Library]: HOST_MAP.library,
  [Platform.Analytics]: HOST_MAP.analytics,
});

const Main = ({ children }: Props): JSX.Element => {
  const { isMainMenuOpen, setIsMainMenuOpen } = useLayoutContext();
  const itemId = useShortenURLParams(ITEM_ID_PARAMS);

  const { isMobile } = useMobileView();

  const getNavigationEvents = usePlatformNavigation(platformsHostsMap, itemId);
  const platformProps = {
    [Platform.Builder]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Builder],
      href: '/',
    },
    [Platform.Player]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Player],
      ...getNavigationEvents(Platform.Player),
    },
    [Platform.Library]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Library],
      ...getNavigationEvents(Platform.Library),
    },
    [Platform.Analytics]: {
      id: APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS[Platform.Analytics],
      ...getNavigationEvents(Platform.Analytics),
    },
  };

  const leftContent = (
    <Box display="flex" ml={2}>
      <StyledLink to={HOME_PATH}>
        <GraaspLogo height={GRAASP_LOGO_HEADER_HEIGHT} sx={{ fill: 'white' }} />
        {!isMobile && (
          <Typography variant="h6" color="inherit" mr={2} ml={1}>
            {APP_NAME}
          </Typography>
        )}
      </StyledLink>
      <PlatformSwitch
        id={APP_NAVIGATION_PLATFORM_SWITCH_ID}
        selected={Platform.Builder}
        platformsProps={platformProps}
      />
    </Box>
  );

  const rightContent = (
    <Grid container>
      <Grid item>
        <NotificationButton />
      </Grid>
      <Grid item>
        <UserSwitchWrapper />
      </Grid>
    </Grid>
  );

  return (
    <GraaspMain
      context={Context.Builder}
      handleDrawerOpen={() => {
        setIsMainMenuOpen(true);
      }}
      handleDrawerClose={() => {
        setIsMainMenuOpen(false);
      }}
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

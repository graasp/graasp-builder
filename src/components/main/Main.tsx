import { Link, useParams } from 'react-router-dom';

import { Stack, styled, useTheme } from '@mui/material';

import { Context } from '@graasp/sdk';
import {
  Main as GraaspMain,
  Platform,
  PlatformSwitch,
  defaultHostsMapper,
  usePlatformNavigation,
} from '@graasp/ui';

import { HOST_MAP } from '@/config/externalPaths';
import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import { HOME_PATH, ITEM_ID_PARAMS } from '../../config/paths';
import {
  APP_NAVIGATION_PLATFORM_SWITCH_BUTTON_IDS,
  APP_NAVIGATION_PLATFORM_SWITCH_ID,
  HEADER_APP_BAR_ID,
} from '../../config/selectors';
import CookiesBanner from '../common/CookiesBanner';
import UserSwitchWrapper from '../common/UserSwitchWrapper';
import MainMenu from './MainMenu';
import NotificationButton from './NotificationButton';

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
}));
const LinkComponent = ({ children }: { children: JSX.Element }) => (
  <StyledLink to={HOME_PATH}>{children}</StyledLink>
);

// small converter for HOST_MAP into a usePlatformNavigation mapper
export const platformsHostsMap = defaultHostsMapper({
  [Platform.Player]: HOST_MAP.player,
  [Platform.Library]: HOST_MAP.library,
  [Platform.Analytics]: HOST_MAP.analytics,
});

type Props = { children: JSX.Element | (JSX.Element & string) };

const Main = ({ children }: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const theme = useTheme();

  const itemId = useParams()[ITEM_ID_PARAMS];

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

  const rightContent = (
    <Stack direction="row" alignItems="center">
      <NotificationButton />
      <UserSwitchWrapper />
    </Stack>
  );
  return (
    <GraaspMain
      context={Context.Builder}
      headerId={HEADER_APP_BAR_ID}
      drawerOpenAriaLabel={t(BUILDER.ARIA_OPEN_DRAWER)}
      headerRightContent={rightContent}
      drawerContent={<MainMenu />}
      LinkComponent={LinkComponent}
      PlatformComponent={
        <PlatformSwitch
          id={APP_NAVIGATION_PLATFORM_SWITCH_ID}
          selected={Platform.Builder}
          platformsProps={platformProps}
          color={theme.palette.primary.main}
          accentColor={theme.palette.secondary.main}
        />
      }
    >
      <CookiesBanner />
      {children}
    </GraaspMain>
  );
};

export default Main;

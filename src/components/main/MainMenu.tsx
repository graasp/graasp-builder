import { useLocation, useNavigate } from 'react-router';

// import { BugReport } from '@mui/icons-material';
import {
  AutoStories,
  Delete,
  Folder,
  FolderShared,
  Star,
} from '@mui/icons-material';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  useTheme,
} from '@mui/material';

import { MainMenu as GraaspMainMenu, LibraryIcon, MenuItem } from '@graasp/ui';

import { TUTORIALS_LINK } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import {
  FAVORITE_ITEMS_PATH,
  HOME_PATH,
  PUBLISHED_ITEMS_PATH,
  RECYCLE_BIN_PATH,
  SHARED_ITEMS_PATH,
} from '../../config/paths';
import { BUILDER } from '../../langs/constants';
import { useCurrentUserContext } from '../context/CurrentUserContext';

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const MainMenu = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: member } = useCurrentUserContext();

  const theme = useTheme();
  const iconColor = theme.palette.action.active;

  const goTo = (path: string) => {
    navigate(path);
  };

  // sentry feedback feature
  // const openBugReport = () => {
  //   const eventId = captureMessage(
  //     `Graasp Builder | User Feedback ${Date.now()}`,
  //   );
  //   // this will be reported in sentry user feedback issues
  //   showReportDialog({
  //     eventId,
  //     title: translateBuilder(BUILDER.REPORT_A_BUG),
  //     lang: i18n.language || DEFAULT_LANG,
  //   });
  // };

  // const reportBugLink = (
  //   <ListItem disablePadding>
  //     <ListItemButton onClick={openBugReport}>
  //       <ListItemIcon>
  //         <BugReport />
  //       </ListItemIcon>
  //       <ListItemText>{translateBuilder(BUILDER.REPORT_A_BUG)}</ListItemText>
  //     </ListItemButton>
  //   </ListItem>
  // );

  const resourceLinks = (
    <ListItem disablePadding>
      <ListItemButton href={TUTORIALS_LINK} target="_blank">
        <ListItemIcon>
          <AutoStories />
        </ListItemIcon>
        <ListItemText>{translateBuilder(BUILDER.TUTORIALS)}</ListItemText>
      </ListItemButton>
    </ListItem>
  );

  const renderAuthenticatedMemberMenuItems = () => {
    if (!member || !member.id) {
      return (
        <StyledMenuItem
          disabled
          text={translateBuilder(BUILDER.HOME_TITLE)}
          icon={<Folder />}
        />
      );
    }

    return (
      <div>
        <MenuItem
          onClick={() => goTo(HOME_PATH)}
          selected={pathname === HOME_PATH}
          icon={<Folder />}
          text={translateBuilder(BUILDER.MY_ITEMS_TITLE)}
        />
        <MenuItem
          onClick={() => goTo(SHARED_ITEMS_PATH)}
          text={translateBuilder(BUILDER.SHARED_ITEMS_TITLE)}
          icon={<FolderShared />}
          selected={pathname === SHARED_ITEMS_PATH}
        />
        <MenuItem
          onClick={() => goTo(FAVORITE_ITEMS_PATH)}
          selected={pathname === FAVORITE_ITEMS_PATH}
          text={translateBuilder(BUILDER.FAVORITE_ITEMS_TITLE)}
          icon={<Star />}
        />
        <MenuItem
          onClick={() => goTo(PUBLISHED_ITEMS_PATH)}
          selected={pathname === PUBLISHED_ITEMS_PATH}
          text="Published items"
          icon={
            <LibraryIcon
              primaryColor={iconColor}
              secondaryColor="#fff"
              size={24}
            />
          }
        />
        <MenuItem
          onClick={() => goTo(RECYCLE_BIN_PATH)}
          selected={pathname === RECYCLE_BIN_PATH}
          text={translateBuilder(BUILDER.RECYCLE_BIN_TITLE)}
          icon={<Delete />}
        />
      </div>
    );
  };

  return (
    <GraaspMainMenu fullHeight>
      <Stack direction="column" height="100%" justifyContent="space-between">
        {renderAuthenticatedMemberMenuItems()}
        <div>
          {/* {reportBugLink} */}
          {resourceLinks}
        </div>
      </Stack>
    </GraaspMainMenu>
  );
};

export default MainMenu;

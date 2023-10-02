import { useLocation, useNavigate } from 'react-router';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import Star from '@mui/icons-material/Star';
import { Box, Button, styled, useTheme } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';

import { DEFAULT_LANG } from '@graasp/sdk';
import { MainMenu as GraaspMainMenu, LibraryIcon, MenuItem } from '@graasp/ui';

import { captureMessage, showReportDialog } from '@sentry/react';

import { TUTORIALS_LINK } from '../../config/constants';
import i18n, { useBuilderTranslation } from '../../config/i18n';
import {
  FAVORITE_ITEMS_PATH,
  HOME_PATH,
  PUBLISHED_ITEMS_PATH,
  RECYCLE_BIN_PATH,
  SHARED_ITEMS_PATH,
} from '../../config/paths';
import { BUILDER } from '../../langs/constants';
import { useCurrentUserContext } from '../context/CurrentUserContext';

const BottomContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  padding: theme.spacing(2),
}));

const StyledLink = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  color: 'grey',
  textDecoration: 'none',
  marginTop: theme.spacing(1),

  '&:hover': {
    color: theme.palette.primary.main,
  },
}));
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

  const openBugReport = () => {
    const eventId = captureMessage(
      `Graasp Builder | User Feedback ${Date.now()}`,
    );
    // this will be reported in sentry user feedback issues
    showReportDialog({
      eventId,
      lang: i18n.language || DEFAULT_LANG,
    });
  };

  const resourceLinks = (
    <BottomContainer>
      <Button onClick={openBugReport}>
        {translateBuilder(BUILDER.REPORT_A_BUG)}
      </Button>

      <StyledLink href={TUTORIALS_LINK} target="_blank">
        <ListItemIcon>
          <AutoStoriesIcon />
        </ListItemIcon>
        {translateBuilder('Tutorials')}
      </StyledLink>
    </BottomContainer>
  );

  const renderAuthenticatedMemberMenuItems = () => {
    if (!member || !member.id) {
      return (
        <StyledMenuItem
          disabled
          text={translateBuilder(BUILDER.HOME_TITLE)}
          icon={<FolderIcon />}
        />
      );
    }

    return (
      <>
        <MenuItem
          onClick={() => goTo(HOME_PATH)}
          selected={pathname === HOME_PATH}
          icon={<FolderIcon />}
          text={translateBuilder(BUILDER.MY_ITEMS_TITLE)}
        />
        <MenuItem
          onClick={() => goTo(SHARED_ITEMS_PATH)}
          text={translateBuilder(BUILDER.SHARED_ITEMS_TITLE)}
          icon={<FolderSharedIcon />}
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
          icon={<DeleteIcon />}
        />
      </>
    );
  };

  return (
    <GraaspMainMenu fullHeight>
      {renderAuthenticatedMemberMenuItems()}
      {resourceLinks}
    </GraaspMainMenu>
  );
};

export default MainMenu;

import { AutoAwesome } from '@mui/icons-material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import Star from '@mui/icons-material/Star';
import { ListItemButton, Stack, styled } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';

import { useLocation, useNavigate } from 'react-router';

import { BUILDER } from '@graasp/translations';
import { MainMenu as GraaspMainMenu, MenuItem } from '@graasp/ui';

import { TUTORIALS_LINK } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import {
  FAVORITE_ITEMS_PATH,
  HOME_PATH,
  RECYCLE_BIN_PATH,
  SHARED_ITEMS_PATH,
} from '../../config/paths';
import {
  TOUR_NAVIGATION_SIDEBAR_ID,
  TOUR_TUTORIALS_LINK_ID,
} from '../../config/selectors';
import { useCurrentUserContext } from '../context/CurrentUserContext';

const StyledLink = styled('a')(({ theme }) => ({
  // position: 'absolute',
  // bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  boxSizing: 'border-box',
  color: 'grey',
  textDecoration: 'none',
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

  const goTo = (path: string) => {
    navigate(path);
  };

  const resourcesLink = (
    <StyledLink
      id={TOUR_TUTORIALS_LINK_ID}
      href={TUTORIALS_LINK}
      target="_blank"
    >
      <ListItemIcon>
        <AutoStoriesIcon />
      </ListItemIcon>
      {translateBuilder('Tutorials')}
    </StyledLink>
  );

  const tourButton = (
    <ListItemButton
      sx={{
        color: 'grey',
        '&:hover': { color: 'purple' },
      }}
    >
      <ListItemIcon sx={{ color: 'inherit' }}>
        <AutoAwesome />
      </ListItemIcon>
      {translateBuilder('Show me around')}
    </ListItemButton>
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
      <div id={TOUR_NAVIGATION_SIDEBAR_ID}>
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
          onClick={() => goTo(RECYCLE_BIN_PATH)}
          selected={pathname === RECYCLE_BIN_PATH}
          text={translateBuilder(BUILDER.RECYCLE_BIN_TITLE)}
          icon={<DeleteIcon />}
        />
      </div>
    );
  };

  return (
    <GraaspMainMenu fullHeight>
      <Stack direction="column" height="100%" justifyContent="space-between">
        {renderAuthenticatedMemberMenuItems()}
        <div>
          {tourButton}
          {resourcesLink}
        </div>
      </Stack>
    </GraaspMainMenu>
  );
};

export default MainMenu;

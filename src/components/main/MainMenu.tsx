import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FolderIcon from '@mui/icons-material/Folder';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { MainMenu as GraaspMainMenu, MenuItem } from '@graasp/ui';

import {
  FAVORITE_ITEMS_PATH,
  HOME_PATH,
  RECYCLE_BIN_PATH,
  SHARED_ITEMS_PATH,
} from '../../config/paths';
import { CurrentUserContext } from '../context/CurrentUserContext';

const MainMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: member } = useContext(CurrentUserContext);

  const goTo = (path: string) => {
    navigate(path);
  };

  const renderAuthenticatedMemberMenuItems = () => {
    if (!member || !member.id) {
      return <MenuItem disabled text={t('Home')} icon={<FolderIcon />} />;
    }

    return (
      <>
        <MenuItem
          onClick={() => goTo(HOME_PATH)}
          selected={pathname === HOME_PATH}
          icon={<FolderIcon />}
          text={t('My Items')}
        />
        <MenuItem
          onClick={() => goTo(SHARED_ITEMS_PATH)}
          text={t('Shared Items')}
          icon={<FolderSharedIcon />}
          selected={pathname === SHARED_ITEMS_PATH}
        />
        <MenuItem
          onClick={() => goTo(FAVORITE_ITEMS_PATH)}
          selected={pathname === FAVORITE_ITEMS_PATH}
          text={t('Favorite Items')}
          icon={<FavoriteIcon />}
        />
        <MenuItem
          onClick={() => goTo(RECYCLE_BIN_PATH)}
          selected={pathname === RECYCLE_BIN_PATH}
          text={t('Trash')}
          icon={<DeleteIcon />}
        />
      </>
    );
  };

  return (
    <GraaspMainMenu>{renderAuthenticatedMemberMenuItems()}</GraaspMainMenu>
  );
};

export default MainMenu;

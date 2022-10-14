import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FolderIcon from '@mui/icons-material/Folder';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

import { FC, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { BUILDER } from '@graasp/translations';
import { MainMenu as GraaspMainMenu, MenuItem } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  FAVORITE_ITEMS_PATH,
  HOME_PATH,
  RECYCLE_BIN_PATH,
  SHARED_ITEMS_PATH,
} from '../../config/paths';
import { CurrentUserContext } from '../context/CurrentUserContext';

const MainMenu: FC = () => {
  const { t } = useBuilderTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: member } = useContext(CurrentUserContext);

  const goTo = (path: string) => {
    navigate(path);
  };

  const renderAuthenticatedMemberMenuItems = () => {
    if (!member || !member.id) {
      return (
        <MenuItem disabled text={t(BUILDER.HOME_TITLE)} icon={<FolderIcon />} />
      );
    }

    return (
      <>
        <MenuItem
          onClick={() => goTo(HOME_PATH)}
          selected={pathname === HOME_PATH}
          icon={<FolderIcon />}
          text={t(BUILDER.MY_ITEMS_TITLE)}
        />
        <MenuItem
          onClick={() => goTo(SHARED_ITEMS_PATH)}
          text={t(BUILDER.SHARED_ITEMS_TITLE)}
          icon={<FolderSharedIcon />}
          selected={pathname === SHARED_ITEMS_PATH}
        />
        <MenuItem
          onClick={() => goTo(FAVORITE_ITEMS_PATH)}
          selected={pathname === FAVORITE_ITEMS_PATH}
          text={t(BUILDER.FAVORITE_ITEMS_TITLE)}
          icon={<FavoriteIcon />}
        />
        <MenuItem
          onClick={() => goTo(RECYCLE_BIN_PATH)}
          selected={pathname === RECYCLE_BIN_PATH}
          text={t(BUILDER.RECYCLE_BIN_TITLE)}
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

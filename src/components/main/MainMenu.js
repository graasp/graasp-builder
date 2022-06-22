import React, { useContext, useState } from 'react';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import ListItem from '@material-ui/core/ListItem';
import FolderIcon from '@material-ui/icons/Folder';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';
import { useLocation, useNavigate } from 'react-router';
import List from '@material-ui/core/List';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {
  FAVORITE_ITEMS_PATH,
  HOME_PATH,
  SHARED_ITEMS_PATH,
  RECYCLE_BIN_PATH,
} from '../../config/paths';
import { CurrentUserContext } from '../context/CurrentUserContext';

const MainMenu = () => {
  const { t } = useTranslation();
  const [dense] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: member } = useContext(CurrentUserContext);

  const goTo = (path) => {
    navigate(path);
  };

  const renderAuthenticatedMemberMenuItems = () => {
    if (member?.isEmpty()) {
      return (
        <ListItem button disabled>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>

          <ListItemText primary={t('Home')} />
        </ListItem>
      );
    }

    return (
      <>
        <ListItem
          button
          onClick={() => goTo(HOME_PATH)}
          selected={pathname === HOME_PATH}
        >
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>

          <ListItemText primary={t('My Items')} />
        </ListItem>
        <ListItem
          button
          onClick={() => goTo(SHARED_ITEMS_PATH)}
          selected={pathname === SHARED_ITEMS_PATH}
        >
          <ListItemIcon>
            <FolderSharedIcon />
          </ListItemIcon>
          <ListItemText primary={t('Shared Items')} />
        </ListItem>
        <ListItem
          button
          onClick={() => goTo(FAVORITE_ITEMS_PATH)}
          selected={pathname === FAVORITE_ITEMS_PATH}
        >
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary={t('Favorite Items')} />
        </ListItem>
        <ListItem
          button
          onClick={() => goTo(RECYCLE_BIN_PATH)}
          selected={pathname === RECYCLE_BIN_PATH}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary={t('Trash')} />
        </ListItem>
      </>
    );
  };

  return <List dense={dense}>{renderAuthenticatedMemberMenuItems()}</List>;
};

export default MainMenu;

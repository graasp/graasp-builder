import React, { useState } from 'react';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import ListItem from '@material-ui/core/ListItem';
import PollIcon from '@material-ui/icons/Poll';
import FolderIcon from '@material-ui/icons/Folder';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';
import { useLocation, useHistory } from 'react-router';
import List from '@material-ui/core/List';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { hooks } from '../../config/queryClient';
import {
  FAVORITE_ITEMS_PATH,
  HOME_PATH,
  SHARED_ITEMS_PATH,
  RECYCLE_BIN_PATH,
} from '../../config/paths';

const MainMenu = () => {
  const { t } = useTranslation();
  const [dense] = useState(true);
  const { push } = useHistory();
  const { pathname } = useLocation();
  const { data: member } = hooks.useCurrentMember();

  const goTo = (path) => {
    push(path);
  };

  const renderAuthenticatedMemberMenuItems = () => {
    if (member.isEmpty()) {
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
          <ListItemText primary={t('Recycle Bin')} />
        </ListItem>
      </>
    );
  };

  return (
    <List dense={dense}>
      {renderAuthenticatedMemberMenuItems()}
      <ListItem button disabled>
        <ListItemIcon>
          <PollIcon />
        </ListItemIcon>
        <ListItemText primary={t('Analytics')} />
      </ListItem>
    </List>
  );
};

export default MainMenu;

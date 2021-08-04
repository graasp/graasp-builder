import React, { useState } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import ListItem from '@material-ui/core/ListItem';
import PollIcon from '@material-ui/icons/Poll';
import FolderIcon from '@material-ui/icons/Folder';
import SchoolIcon from '@material-ui/icons/School';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';
import { useLocation, useHistory } from 'react-router';
import List from '@material-ui/core/List';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PropTypes from 'prop-types';
import { Loader } from '@graasp/ui';
import {
  FAVORITE_ITEMS_PATH,
  HOME_PATH,
  linkBuilder,
  SHARED_ITEMS_PATH,
} from '../../config/paths';
import { hooks } from '../../config/queryClient';

const MainMenu = ({ groupId }) => {
  const { t } = useTranslation();
  const [dense] = useState(true);
  const { push } = useHistory();
  const { pathname } = useLocation();

  const goTo = (path) => {
    push(path);
  };

  const { data: group, isLoading } = hooks.useGroup(groupId);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <List dense={dense}>
      <ListItem
        button
        onClick={() => goTo(linkBuilder({ groupId }).HOME_PATH)}
        selected={pathname.endsWith(HOME_PATH)}
      >
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>

        <ListItemText
          primary={group ? t(`${group.get('name')}'s Items`) : t('My Items')}
        />
      </ListItem>
      <ListItem
        button
        onClick={() => goTo(linkBuilder({ groupId }).SHARED_ITEMS_PATH)}
        selected={pathname.endsWith(SHARED_ITEMS_PATH)}
      >
        <ListItemIcon>
          <FolderSharedIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            group ? t(`${group.get('name')}'s Shared Items`) : t('Shared Items')
          }
        />
      </ListItem>
      <ListItem
        button
        onClick={() => goTo(linkBuilder({ groupId }).FAVORITE_ITEMS_PATH)}
        selected={pathname.endsWith(FAVORITE_ITEMS_PATH)}
      >
        <ListItemIcon>
          <FavoriteIcon />
        </ListItemIcon>
        <ListItemText primary={t('Favorite Items')} />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PollIcon />
        </ListItemIcon>
        <ListItemText primary={t('Analytics')} />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary={t('Perform View')} />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary={t('Trash')} />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary={t('Settings')} />
      </ListItem>
    </List>
  );
};

MainMenu.propTypes = {
  groupId: PropTypes.string,
};

MainMenu.defaultProps = {
  groupId: '',
};
export default MainMenu;

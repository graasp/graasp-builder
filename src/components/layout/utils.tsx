import GroupsIcon from '@mui/icons-material/Groups';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';

import { LibraryIcon } from '@graasp/ui';

import {
  buildItemInformationPath,
  buildItemPublishPath,
  buildItemSettingsPath,
  buildItemSharePath,
} from '@/config/paths';
import { BUILDER } from '@/langs/constants';

const ItemAction = {
  SETTINGS: 'settings',
  INFORMATION: 'information',
  SHARE: 'share',
  PUBLISH: 'publish',
};
export interface MenuItemType {
  name: string;
  path: string;
}
export interface ExtraItem {
  name: string;
  path: string;
  icon?: JSX.Element;
  menuItems?: MenuItemType[];
}

export const buildExtraItems = ({
  translate,
  location,
  itemId,
}: {
  location: string;
  itemId?: string;
  translate: (s: string) => string;
}): ExtraItem[] => {
  if (!itemId) {
    return [];
  }
  // we don't switch to sub pages
  // const menuItems = [
  //   {
  //     name: translate(BUILDER.SETTINGS_TITLE),
  //     path: buildItemSettingsPath(itemId),
  //   },
  //   {
  //     name: translate(BUILDER.SHARE_ITEM_BUTTON),
  //     path: buildItemSharePath(itemId),
  //   },
  //   {
  //     name: translate(BUILDER.LIBRARY_SETTINGS_PUBLISH_BUTTON),
  //     path: buildItemPublishPath(itemId),
  //   },
  //   {
  //     name: translate(BUILDER.ITEM_ACTION_INFORMATION),
  //     path: buildItemInformationPath(itemId),
  //   },
  // ];

  switch (location) {
    case ItemAction.SETTINGS:
      return [
        {
          name: translate(BUILDER.SETTINGS_TITLE),
          icon: <SettingsIcon />,
          path: buildItemSettingsPath(itemId),
          menuItems: [],
        },
      ];
    case ItemAction.SHARE:
      return [
        {
          name: translate(BUILDER.SHARE_ITEM_BUTTON),
          icon: <GroupsIcon />,
          path: buildItemSharePath(itemId),
          menuItems: [],
        },
      ];
    case ItemAction.PUBLISH:
      return [
        {
          name: translate(BUILDER.LIBRARY_SETTINGS_PUBLISH_BUTTON),
          icon: <LibraryIcon size={24} showSetting primaryColor="#777" />,
          path: buildItemPublishPath(itemId),
          menuItems: [],
        },
      ];
    case ItemAction.INFORMATION:
      return [
        {
          name: translate(BUILDER.ITEM_ACTION_INFORMATION),
          icon: <InfoIcon />,
          path: buildItemInformationPath(itemId),
          menuItems: [],
        },
      ];
    default:
      return [];
  }
};

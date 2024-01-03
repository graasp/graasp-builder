import GroupsIcon from '@mui/icons-material/Groups';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';

import { LibraryIcon } from '@graasp/ui';

import {
  ITEM_INFORMATION_PATH,
  ITEM_PUBLISH_PATH,
  ITEM_SETTINGS_PATH,
  ITEM_SHARE_PATH,
  buildItemInformationPath,
  buildItemPath,
  buildItemPublishPath,
  buildItemSettingsPath,
  buildItemSharePath,
} from '@/config/paths';
import { BUILDER } from '@/langs/constants';

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

  const page = buildItemPath(location);

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

  switch (true) {
    case page.includes(ITEM_SETTINGS_PATH):
      return [
        {
          name: translate(BUILDER.SETTINGS_TITLE),
          icon: <SettingsIcon />,
          path: buildItemSettingsPath(itemId),
          menuItems: [],
        },
      ];
    case page.includes(ITEM_SHARE_PATH):
      return [
        {
          name: translate(BUILDER.SHARE_ITEM_BUTTON),
          icon: <GroupsIcon />,
          path: buildItemSharePath(itemId),
          menuItems: [],
        },
      ];
    case page.includes(ITEM_PUBLISH_PATH):
      return [
        {
          name: translate(BUILDER.LIBRARY_SETTINGS_PUBLISH_BUTTON),
          icon: <LibraryIcon size={24} showSetting primaryColor="#777" />,
          path: buildItemPublishPath(itemId),
          menuItems: [],
        },
      ];
    case page.includes(ITEM_INFORMATION_PATH):
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

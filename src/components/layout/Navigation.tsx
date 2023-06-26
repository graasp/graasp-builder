import { useLocation, useMatch } from 'react-router-dom';

import { BUILDER } from '@graasp/translations';
import { HomeMenu, ItemMenu, Navigation } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  FAVORITE_ITEMS_PATH,
  HOME_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
} from '../../config/paths';
import { hooks } from '../../config/queryClient';
import {
  NAVIGATION_ROOT_ID,
  buildNavigationLink,
} from '../../config/selectors';

const {
  useItem,
  useParents,
  useCurrentMember,
  useChildren,
  useOwnItems,
  useSharedItems,
} = hooks;

const Navigator = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const match = useMatch(buildItemPath());
  const { pathname } = useLocation();
  const itemId = match?.params?.itemId;
  const { data: currentMember } = useCurrentMember();
  const { data: item, isLoading: isItemLoading } = useItem(itemId);
  const itemPath = item?.path;

  const { data: parents, isLoading: areParentsLoading } = useParents({
    id: itemId,
    path: itemPath,
    enabled: !!itemPath,
  });

  const isParentOwned =
    (item?.creator?.id ?? parents?.first()?.creator?.id) === currentMember?.id;

  if (isItemLoading || areParentsLoading) {
    return null;
  }

  const buildToItemPath = (id: string) => buildItemPath(id);

  const menu = [
    {
      name: translateBuilder(BUILDER.NAVIGATION_MY_ITEMS_TITLE),
      id: 'home',
      to: HOME_PATH,
    },
    {
      name: translateBuilder(BUILDER.NAVIGATION_SHARED_ITEMS_TITLE),
      id: 'shared',
      to: SHARED_ITEMS_PATH,
    },
    {
      name: translateBuilder(BUILDER.NAVIGATION_FAVORITE_ITEMS_TITLE),
      id: 'favorite',
      to: FAVORITE_ITEMS_PATH,
    },
  ];

  const renderRoot = () => {
    // no access to root if signed out
    if (!currentMember) {
      return null;
    }

    const selected =
      isParentOwned || pathname === HOME_PATH ? menu[0] : menu[1];

    return (
      <>
        <HomeMenu
          selected={selected}
          elements={menu}
          buildMenuItemId={buildNavigationLink}
        />
        <ItemMenu
          itemId="root"
          useChildren={
            isParentOwned || pathname === HOME_PATH
              ? (useOwnItems as any)
              : useSharedItems
          }
          buildToItemPath={buildToItemPath}
        />
      </>
    );
  };

  if (
    item === undefined &&
    pathname !== SHARED_ITEMS_PATH &&
    pathname !== HOME_PATH
  ) {
    return null;
  }

  return (
    <Navigation
      id={NAVIGATION_ROOT_ID}
      sx={{ paddingLeft: 2 }}
      item={item}
      buildToItemPath={buildToItemPath}
      parents={parents}
      renderRoot={renderRoot}
      buildMenuItemId={buildNavigationLink}
      useChildren={useChildren as any}
    />
  );
};

export default Navigator;
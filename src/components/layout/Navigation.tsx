import { useLocation, useMatch } from 'react-router-dom';

import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { Navigation as GraaspNavigation, HomeMenu, ItemMenu } from '@graasp/ui';

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

const Navigation = (): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const match = useMatch(buildItemPath());
  const { pathname } = useLocation();
  const itemId = match?.params?.itemId;
  const { data: currentMember } = useCurrentMember();
  const { data: item, isLoading: isItemLoading } = useItem(itemId);
  const itemPath = item?.path;

  const { data: parents, isLoading: areParentsLoading } = useParents({
    id: itemId ?? '',
    path: itemPath ?? '',
    enabled: !!itemId && !!itemPath,
  });

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

  const renderRoot = (thisItem?: ItemRecord) => {
    if (!thisItem) {
      return null;
    }

    let selected = menu[0];
    const isParentOwned =
      (item?.creator?.id ?? parents?.first()?.creator?.id) ===
      currentMember?.id;

    // favorite root path
    if (pathname === FAVORITE_ITEMS_PATH) {
      // eslint-disable-next-line prefer-destructuring
      selected = menu[2];
    }
    // shared items and non owned items
    else if (
      pathname === SHARED_ITEMS_PATH ||
      (pathname !== HOME_PATH && !isParentOwned)
    ) {
      // eslint-disable-next-line prefer-destructuring
      selected = menu[1];
    }

    return (
      <>
        <HomeMenu selected={selected} elements={menu} />
        <ItemMenu
          itemId={thisItem.id}
          useChildren={isParentOwned ? useOwnItems : useSharedItems}
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
    <GraaspNavigation
      id={NAVIGATION_ROOT_ID}
      sx={{ paddingLeft: 2 }}
      item={item}
      buildToItemPath={buildToItemPath}
      parents={parents}
      renderRoot={renderRoot}
      buildBreadcrumbsItemLinkId={buildNavigationLink}
      useChildren={useChildren}
    />
  );
};

export default Navigation;

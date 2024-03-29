import { useLocation, useParams } from 'react-router-dom';

import { HomeMenu, ItemMenu, Navigation } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  BOOKMARKED_ITEMS_PATH,
  HOME_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
} from '../../config/paths';
import { hooks } from '../../config/queryClient';
import {
  NAVIGATION_ROOT_ID,
  buildNavigationLink,
} from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { buildExtraItems } from './utils';

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
  const { itemId } = useParams();
  const { pathname } = useLocation();
  const { data: currentMember } = useCurrentMember();
  const { data: item, isLoading: isItemLoading } = useItem(itemId);
  const itemPath = item?.path;

  const { pathname: location } = useLocation();

  const { data: parents, isLoading: areParentsLoading } = useParents({
    id: itemId,
    path: itemPath,
    enabled: !!itemPath,
  });

  const isParentOwned =
    currentMember &&
    (item?.creator?.id ?? parents?.[0]?.creator?.id) === currentMember?.id;

  if (isItemLoading || areParentsLoading) {
    return null;
  }

  const buildToItemPath = (id: string) => buildItemPath(id);

  const menu = [
    // todo: remove distinction -> not a good idea to show the whole root in arrow
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
      name: translateBuilder(BUILDER.NAVIGATION_BOOKMARKED_ITEMS_TITLE),
      id: 'bookmark',
      to: BOOKMARKED_ITEMS_PATH,
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

  const extraItems = buildExtraItems({
    translate: translateBuilder,
    location,
    itemId,
  });

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
      extraItems={extraItems}
    />
  );
};

export default Navigator;

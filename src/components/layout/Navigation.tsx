import { Link, useLocation, useParams } from 'react-router-dom';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';

import { Navigation } from '@graasp/ui';

import { Home } from 'lucide-react';

import { useBuilderTranslation } from '../../config/i18n';
import {
  BOOKMARKED_ITEMS_PATH,
  HOME_PATH,
  buildItemPath,
} from '../../config/paths';
import { hooks } from '../../config/queryClient';
import {
  NAVIGATION_HOME_ID,
  NAVIGATION_ROOT_ID,
  buildNavigationLink,
} from '../../config/selectors';
import { buildExtraItems } from './utils';

const { useItem, useParents, useCurrentMember, useChildren } = hooks;

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

    return (
      <>
        <Link to={HOME_PATH}>
          <IconButton id={NAVIGATION_HOME_ID}>
            <Home />
          </IconButton>
        </Link>
        <ArrowForwardIosIcon sx={{ m: 2 }} fontSize="inherit" />
      </>
    );
  };

  if (item === undefined && pathname !== HOME_PATH) {
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

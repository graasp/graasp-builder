import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { IconButton } from '@mui/material';

import { AccountType } from '@graasp/sdk';
import { Navigation } from '@graasp/ui';

import { ChevronRightIcon, Home } from 'lucide-react';

import { useBuilderTranslation } from '../../config/i18n';
import { HOME_PATH, buildItemPath } from '../../config/paths';
import { hooks } from '../../config/queryClient';
import {
  NAVIGATION_HOME_ID,
  NAVIGATION_ROOT_ID,
  buildNavigationLink,
} from '../../config/selectors';
import { buildExtraItems } from './utils';

const { useItem, useParents, useCurrentMember, useChildren } = hooks;

const Navigator = (): JSX.Element | null => {
  const [searchParams] = useSearchParams();
  const { t: translateBuilder } = useBuilderTranslation();
  const { itemId } = useParams();
  const { pathname } = useLocation();
  const { data: currentMember } = useCurrentMember();
  const { data: item, isLoading: isItemLoading } = useItem(itemId);

  const { pathname: location } = useLocation();

  const { data: parents, isLoading: areParentsLoading } = useParents({
    id: itemId,
  });

  if (isItemLoading || areParentsLoading) {
    return null;
  }

  const buildToItemPath = (id: string) =>
    `${buildItemPath(id)}?${searchParams.toString()}`;

  const renderRoot = () => {
    // no access to root if signed out
    if (currentMember?.type !== AccountType.Individual) {
      return null;
    }

    return (
      <>
        <Link to={{ pathname: HOME_PATH, search: searchParams.toString() }}>
          <IconButton id={NAVIGATION_HOME_ID}>
            <Home />
          </IconButton>
        </Link>
        <ChevronRightIcon />
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

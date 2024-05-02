import { useLocation, useNavigate, useParams } from 'react-router-dom';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';

import { Navigation } from '@graasp/ui';

import { Home } from 'lucide-react';

import { useBuilderTranslation } from '../../config/i18n';
import { HOME_PATH, buildItemPath } from '../../config/paths';
import { hooks } from '../../config/queryClient';
import {
  NAVIGATION_ROOT_ID,
  buildNavigationLink,
} from '../../config/selectors';
import { buildExtraItems } from './utils';

const { useItem, useParents, useCurrentMember, useChildren } = hooks;

const Navigator = (): JSX.Element | null => {
  const navigate = useNavigate();
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

  const renderRoot = () => {
    // no access to root if signed out
    if (!currentMember) {
      return null;
    }

    return (
      <>
        <IconButton onClick={() => navigate(HOME_PATH)}>
          <Home />
        </IconButton>
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

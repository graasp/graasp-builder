import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import {
  HOME_PATH,
  buildItemPath,
  SHARED_ITEMS_PATH,
} from '../../config/paths';
import {
  buildNavigationLink,
  NAVIGATION_HIDDEN_PARENTS_ID,
  NAVIGATION_HOME_LINK_ID,
} from '../../config/selectors';
import Loader from '../common/Loader';
import { useCurrentMember, useItem, useParents } from '../../hooks';
import { getParentsIdsFromPath } from '../../utils/item';

const useStyles = makeStyles(() => ({
  parents: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

const Navigation = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { pathname } = useLocation();
  const match = useRouteMatch(buildItemPath());
  const itemId = match?.params?.itemId;
  const { data: user, isLoading: isUserLoading } = useCurrentMember();
  const { data: item, isLoading: isItemLoading } = useItem(itemId);
  const itemPath = item?.get('path');
  const [parentsOpen, setParentsOpen] = useState(false);
  const { data: parents, isLoading: parentIsLoading } = useParents({
    id: itemId,
    path: itemPath,
    enabled: parentsOpen,
  });

  if (isUserLoading || isItemLoading) {
    return <Loader />;
  }

  const onParentsClick = () => {
    setParentsOpen(!parentsOpen);
  };

  const renderRootLink = () => {
    // build root depending on user permission or pathname
    // todo: consider accessing from guest
    const ownItem =
      pathname === HOME_PATH || item?.get('creator') === user.get('id');
    const to = ownItem ? HOME_PATH : SHARED_ITEMS_PATH;
    const text = ownItem ? t('My Items') : t('Shared Items');

    return (
      <Link color="inherit" to={to}>
        <Typography id={NAVIGATION_HOME_LINK_ID}>{text}</Typography>
      </Link>
    );
  };

  const renderParents = () => {
    // nothing to display if no parents
    const p = item?.get('path');
    if (!p || getParentsIdsFromPath(p).length <= 1) {
      return null;
    }

    // display parents only when needed
    // todo: display parents if in database
    if (!parentsOpen) {
      return (
        <Typography
          id={NAVIGATION_HIDDEN_PARENTS_ID}
          className={classes.parents}
          onClick={onParentsClick}
        >
          ...
        </Typography>
      );
    }

    if (parentIsLoading) {
      return <Loader />;
    }

    return parents?.map(({ name, id }) => (
      <Link key={id} to={buildItemPath(id)}>
        <Typography id={buildNavigationLink(id)}>{name}</Typography>
      </Link>
    ));
  };

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {renderRootLink()}
      {renderParents()}
      {itemId && (
        <Link key={itemId} to={buildItemPath(itemId)}>
          <Typography id={buildNavigationLink(itemId)}>
            {item.get('name')}
          </Typography>
        </Link>
      )}
    </Breadcrumbs>
  );
};

export default Navigation;

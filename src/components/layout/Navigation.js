import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import truncate from 'lodash.truncate';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link, useLocation, useMatch } from 'react-router-dom';
import {
  HOME_PATH,
  buildItemPath,
  SHARED_ITEMS_PATH,
  FAVORITE_ITEMS_PATH,
} from '../../config/paths';
import {
  buildNavigationLink,
  NAVIGATION_HIDDEN_PARENTS_ID,
  NAVIGATION_HOME_LINK_ID,
  NAVIGATION_ROOT_ID,
} from '../../config/selectors';
import Loader from '../common/Loader';
import { hooks } from '../../config/queryClient';
import { getParentsIdsFromPath } from '../../utils/item';
import { ITEM_NAME_MAX_LENGTH, LOADING_CONTENT } from '../../config/constants';
import { CurrentUserContext } from '../context/CurrentUserContext';

const { useItem, useParents } = hooks;

const useStyles = makeStyles(() => ({
  parents: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

const ParentLink = ({ id, name }) => (
  <Link key={id} to={buildItemPath(id)}>
    <Typography id={buildNavigationLink(id)}>{name}</Typography>
  </Link>
);

ParentLink.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const Navigation = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { pathname } = useLocation();
  const match = useMatch(buildItemPath());
  const { data: currentMember } = useContext(CurrentUserContext);
  const itemId = match?.params?.itemId;
  const { data: item, isLoading: isItemLoading } = useItem(itemId);
  const itemPath = item?.path;

  const [parentsOpen, setParentsOpen] = useState(false);
  const { data: parents, isLoading: parentIsLoading } = useParents({
    id: itemId,
    path: itemPath,
    enabled: true,
  });

  if (isItemLoading) {
    return <Loader />;
  }

  const onParentsClick = () => {
    setParentsOpen(!parentsOpen);
  };

  const renderRootLink = () => {
    // build root depending on user permission or pathname

    // does not show root if user is not authenticated
    const currentMemberId = currentMember?.id;
    if (!currentMemberId) {
      return null;
    }

    let to = HOME_PATH;
    let text = t('My Items');

    const isParentOwned =
      (item?.creator ?? parents?.first()?.creator) === currentMemberId;

    // favorite root path
    if (pathname === FAVORITE_ITEMS_PATH) {
      to = FAVORITE_ITEMS_PATH;
      text = t('Favorite Items');
    }
    // shared items and non owned items
    else if (
      pathname === SHARED_ITEMS_PATH ||
      (pathname !== HOME_PATH && !isParentOwned)
    ) {
      to = SHARED_ITEMS_PATH;
      text = t('Shared Items');
    }

    return (
      <Link color="inherit" to={to} id={NAVIGATION_ROOT_ID}>
        <Typography id={NAVIGATION_HOME_LINK_ID}>{text}</Typography>
      </Link>
    );
  };

  const renderParents = () => {
    // nothing to display if no parents
    const p = item?.path;
    if (!p || getParentsIdsFromPath(p).length <= 1) {
      return null;
    }

    if (parentIsLoading) {
      return (
        <Typography
          id={NAVIGATION_HIDDEN_PARENTS_ID}
          className={classes.parents}
        >
          {LOADING_CONTENT}
        </Typography>
      );
    }

    // filter out non-accessible parents
    // cases for items in a shared item
    const availableParents = parents?.filter(Boolean);

    // display parents only when needed
    // always display last and first parent
    if (!parentsOpen) {
      return [
        availableParents?.size >= 1 && (
          <ParentLink
            name={availableParents.first().name}
            id={availableParents.first().id}
          />
        ),
        availableParents?.size >= 3 && (
          <Typography
            id={NAVIGATION_HIDDEN_PARENTS_ID}
            className={classes.parents}
            onClick={onParentsClick}
          >
            {LOADING_CONTENT}
          </Typography>
        ),
        availableParents?.size >= 2 && (
          <ParentLink
            name={availableParents.last().name}
            id={availableParents.last().id}
          />
        ),
      ];
    }

    return availableParents?.map(({ name, id }) => (
      <ParentLink name={name} id={id} />
    ));
  };

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {renderRootLink()}
      {renderParents()}
      {itemId && (
        <Link key={itemId} to={buildItemPath(itemId)}>
          <Typography id={buildNavigationLink(itemId)}>
            {truncate(item.name, { length: ITEM_NAME_MAX_LENGTH })}
          </Typography>
        </Link>
      )}
    </Breadcrumbs>
  );
};

export default Navigation;

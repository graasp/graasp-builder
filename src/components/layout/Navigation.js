import React, { useState } from 'react';
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
} from '../../config/selectors';
import Loader from '../common/Loader';
import { hooks } from '../../config/queryClient';
import { getParentsIdsFromPath } from '../../utils/item';
import { ITEM_NAME_MAX_LENGTH, LOADING_CONTENT } from '../../config/constants';

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
  const itemId = match?.params?.itemId;
  const { data: item, isLoading: isItemLoading } = useItem(itemId);
  const itemPath = item?.get('path');
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
    // todo: consider accessing from guest

    let to;
    let text;

    switch (pathname) {
      case SHARED_ITEMS_PATH: {
        to = SHARED_ITEMS_PATH;
        text = t('Shared Items');
        break;
      }
      case FAVORITE_ITEMS_PATH: {
        to = FAVORITE_ITEMS_PATH;
        text = t('Favorite Items');
        break;
      }
      default: {
        to = HOME_PATH;
        text = t('My Items');
      }
    }

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

    // display parents only when needed
    // always display last and first parent
    if (!parentsOpen) {
      return [
        parents?.size >= 1 && (
          <ParentLink name={parents.first().name} id={parents.first().id} />
        ),
        parents?.size >= 3 && (
          <Typography
            id={NAVIGATION_HIDDEN_PARENTS_ID}
            className={classes.parents}
            onClick={onParentsClick}
          >
            {LOADING_CONTENT}
          </Typography>
        ),
        parents?.size >= 2 && (
          <ParentLink name={parents.last().name} id={parents.last().id} />
        ),
      ];
    }

    return parents?.map(({ name, id }) => <ParentLink name={name} id={id} />);
  };

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {renderRootLink()}
      {renderParents()}
      {itemId && (
        <Link key={itemId} to={buildItemPath(itemId)}>
          <Typography id={buildNavigationLink(itemId)}>
            {truncate(item.get('name'), { length: ITEM_NAME_MAX_LENGTH })}
          </Typography>
        </Link>
      )}
    </Breadcrumbs>
  );
};

export default Navigation;

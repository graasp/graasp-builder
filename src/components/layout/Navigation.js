import truncate from 'lodash.truncate';
import PropTypes from 'prop-types';

import { styled } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';

import { useContext, useState } from 'react';
import { Link, useLocation, useMatch } from 'react-router-dom';

import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { ITEM_NAME_MAX_LENGTH, LOADING_CONTENT } from '../../config/constants';
import { useBuilderTranslation } from '../../config/i18n';
import {
  FAVORITE_ITEMS_PATH,
  HOME_PATH,
  SHARED_ITEMS_PATH,
  buildItemPath,
} from '../../config/paths';
import { hooks } from '../../config/queryClient';
import {
  NAVIGATION_HIDDEN_PARENTS_ID,
  NAVIGATION_HOME_LINK_ID,
  NAVIGATION_ROOT_ID,
  buildNavigationLink,
} from '../../config/selectors';
import { getParentsIdsFromPath } from '../../utils/item';
import { CurrentUserContext } from '../context/CurrentUserContext';

const { useItem, useParents } = hooks;

const ParentTitle = styled(Typography)(() => ({
  '&:hover': {
    cursor: 'pointer',
  },
}));

const StyledLink = styled(Link)({
  textDecoration: 'none',
});

const ParentLink = ({ id, name }) => (
  <StyledLink key={id} to={buildItemPath(id)}>
    <Typography id={buildNavigationLink(id)}>
      {truncate(name, { length: ITEM_NAME_MAX_LENGTH })}
    </Typography>
  </StyledLink>
);

ParentLink.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const Navigation = () => {
  const { t } = useBuilderTranslation();
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
    let text = t(BUILDER.NAVIGATION_MY_ITEMS_TITLE);

    const isParentOwned =
      (item?.creator ?? parents?.first()?.creator) === currentMemberId;

    // favorite root path
    if (pathname === FAVORITE_ITEMS_PATH) {
      to = FAVORITE_ITEMS_PATH;
      text = t(BUILDER.NAVIGATION_FAVORITE_ITEMS_TITLE);
    }
    // shared items and non owned items
    else if (
      pathname === SHARED_ITEMS_PATH ||
      (pathname !== HOME_PATH && !isParentOwned)
    ) {
      to = SHARED_ITEMS_PATH;
      text = t(BUILDER.NAVIGATION_SHARED_ITEMS_TITLE);
    }

    return (
      <StyledLink color="inherit" to={to} id={NAVIGATION_ROOT_ID}>
        <Typography id={NAVIGATION_HOME_LINK_ID}>{text}</Typography>
      </StyledLink>
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
        <ParentTitle id={NAVIGATION_HIDDEN_PARENTS_ID}>
          {LOADING_CONTENT}
        </ParentTitle>
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
          <ParentTitle
            id={NAVIGATION_HIDDEN_PARENTS_ID}
            onClick={onParentsClick}
          >
            {LOADING_CONTENT}
          </ParentTitle>
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
      <ParentLink key={id} name={name} id={id} />
    ));
  };

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {renderRootLink()}
      {renderParents()}
      {itemId && (
        <StyledLink key={itemId} to={buildItemPath(itemId)}>
          <Typography id={buildNavigationLink(itemId)}>
            {truncate(item.name, { length: ITEM_NAME_MAX_LENGTH })}
          </Typography>
        </StyledLink>
      )}
    </Breadcrumbs>
  );
};

export default Navigation;

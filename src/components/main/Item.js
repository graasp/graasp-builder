import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card as GraaspCard, Thumbnail } from '@graasp/ui';
import truncate from 'lodash.truncate';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { buildItemCard, buildItemLink } from '../../config/selectors';
import {
  DEFAULT_IMAGE_SRC,
  DESCRIPTION_MAX_LENGTH,
} from '../../config/constants';
import EditButton from '../common/EditButton';
import { isItemUpdateAllowedForUser } from '../../utils/membership';
import { stripHtml } from '../../utils/item';
import ItemMenu from './ItemMenu';
import FavoriteButton from '../common/FavoriteButton';
import PinButton from '../common/PinButton';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { buildItemPath } from '../../config/paths';
import { hooks } from '../../config/queryClient';

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

const Item = ({ item, memberships }) => {
  const classes = useStyles();
  const { id, name, description, extra } = item;
  const { t } = useTranslation();

  const ThumbnailComponent = Thumbnail({
    id: item.id,
    extra,
    // maxWidth: 30,
    // maxHeight: 30,
    alt: t('thumbnail'),
    defaultImage: DEFAULT_IMAGE_SRC,
    useThumbnail: hooks.useItemThumbnail,
    className: classes.thumbnail,
  });

  const { data: member } = useContext(CurrentUserContext);
  const enableEdition = isItemUpdateAllowedForUser({
    memberships,
    memberId: member?.get('id'),
  });

  const Actions = (
    <>
      {!member.isEmpty() && <FavoriteButton member={member} item={item} />}
      {enableEdition && (
        <>
          <EditButton item={item} />
          <PinButton item={item} />
        </>
      )}
    </>
  );

  const NameWrapper = useMemo(
    ({ children }) => (
      <Link
        to={buildItemPath(id)}
        id={buildItemLink(id)}
        className={classes.link}
      >
        {children}
      </Link>
    ),
    [id, classes],
  );

  return (
    <GraaspCard
      description={truncate(stripHtml(description), {
        length: DESCRIPTION_MAX_LENGTH,
      })}
      Actions={Actions}
      name={name}
      creator={member?.get('name')}
      ItemMenu={<ItemMenu item={item} canEdit={enableEdition} />}
      Thumbnail={ThumbnailComponent}
      cardId={buildItemCard(id)}
      NameWrapper={NameWrapper}
    />
  );
};

Item.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    creator: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    extra: PropTypes.shape({
      image: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  memberships: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Item;

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
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
import { CurrentUserContext } from '../context/CurrentUserContext';
import { buildItemPath } from '../../config/paths';
import { hooks } from '../../config/queryClient';
import DownloadButton from './DownloadButton';
import { getEmbeddedLinkExtra } from '../../utils/itemExtra';

const NameWrapper =
  ({ id, className }) =>
  // eslint-disable-next-line react/prop-types
  ({ children }) =>
    (
      <Link to={buildItemPath(id)} id={buildItemLink(id)} className={className}>
        {children}
      </Link>
    );

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

  const alt = t('thumbnail');
  const classname = classes.thumbnail;
  const defaultValueComponent = (
    <img
      src={DEFAULT_IMAGE_SRC}
      alt={alt}
      className={clsx(classes.img, classname)}
    />
  );
  const ThumbnailComponent = (
    <Thumbnail
      id={item.id}
      extraThumbnail={getEmbeddedLinkExtra(extra)?.thumbnails?.get(0)}
      alt={alt}
      defaultValue={defaultValueComponent}
      useThumbnail={hooks.useItemThumbnail}
      className={classname}
    />
  );

  const { data: member } = useContext(CurrentUserContext);
  const enableEdition = isItemUpdateAllowedForUser({
    memberships,
    memberId: member?.id,
  });

  // We need to convert the Record<item> (immutable) to item (object)
  // because the following components are shared between the Grid and Table views
  const Actions = (
    <>
      {!member.toSeq().isEmpty() && (
        <FavoriteButton member={member} item={item} />
      )}
      {enableEdition && (
        <>
          <EditButton item={item.toJS()} />
          <DownloadButton id={id} name={name} />
        </>
      )}
    </>
  );

  return (
    <GraaspCard
      description={truncate(stripHtml(description), {
        length: DESCRIPTION_MAX_LENGTH,
      })}
      Actions={Actions}
      name={name}
      creator={member?.name}
      ItemMenu={<ItemMenu item={item} canEdit={enableEdition} />}
      Thumbnail={ThumbnailComponent}
      cardId={buildItemCard(id)}
      NameWrapper={NameWrapper({ id, className: classes.link })}
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

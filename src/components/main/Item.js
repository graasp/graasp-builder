import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card as GraaspCard, Thumbnail, DownloadButton } from '@graasp/ui';
import { MUTATION_KEYS } from '@graasp/query-client';
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
import { hooks, useMutation } from '../../config/queryClient';
import HideButton from '../common/HideButton';

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

  const {
    mutate: downloadItem,
    data,
    isSuccess,
    isLoading: isDownloading,
  } = useMutation(MUTATION_KEYS.EXPORT_ZIP);

  useEffect(() => {
    if (isSuccess) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${item.id}.zip`);
      document.body.appendChild(link);
      link.click();
    }
  }, [data, isSuccess, item]);

  const handleDownload = () => {
    downloadItem(item.id);
  };

  const Actions = (
    <>
      {!member.isEmpty() && <FavoriteButton member={member} item={item} />}
      {enableEdition && (
        <>
          <EditButton item={item} />
          <PinButton item={item} />
          <HideButton item={item} />
          <DownloadButton
            handleDownload={handleDownload}
            isLoading={isDownloading}
          />
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
      creator={member?.get('name')}
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

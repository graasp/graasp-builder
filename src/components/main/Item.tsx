import { RecordOf } from 'immutable';
import truncate from 'lodash.truncate';

import { CSSProperties, FC, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Item as GraaspItem, ItemMembership } from '@graasp/sdk';
import { Card as GraaspCard, Thumbnail } from '@graasp/ui';

import {
  DEFAULT_IMAGE_SRC,
  DESCRIPTION_MAX_LENGTH,
} from '../../config/constants';
import { buildItemPath } from '../../config/paths';
import { hooks } from '../../config/queryClient';
import { buildItemCard, buildItemLink } from '../../config/selectors';
import { stripHtml } from '../../utils/item';
import { getEmbeddedLinkExtra } from '../../utils/itemExtra';
import { isItemUpdateAllowedForUser } from '../../utils/membership';
import EditButton from '../common/EditButton';
import FavoriteButton from '../common/FavoriteButton';
import { CurrentUserContext } from '../context/CurrentUserContext';
import DownloadButton from './DownloadButton';
import ItemMenu from './ItemMenu';

const NameWrapper =
  ({ id, style }: { id: string; style: CSSProperties }) =>
  // eslint-disable-next-line react/prop-types, react/display-name
  ({ children }: { children: JSX.Element }) =>
    (
      <Link to={buildItemPath(id)} id={buildItemLink(id)} style={style}>
        {children}
      </Link>
    );

type Props = {
  item: RecordOf<GraaspItem>;
  memberships: RecordOf<ItemMembership>[];
};

const Item: FC<Props> = ({ item, memberships }) => {
  const { id, name, description, extra } = item;

  const alt = name;
  const defaultValueComponent = (
    <img
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
      src={DEFAULT_IMAGE_SRC}
      alt={alt}
    />
  );
  const ThumbnailComponent = (
    <Thumbnail
      id={item.id}
      thumbnailSrc={getEmbeddedLinkExtra(extra)?.thumbnails?.get(0)}
      alt={alt}
      defaultValue={defaultValueComponent}
      // todo: fix in ui
      useThumbnail={hooks.useItemThumbnail as any}
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
      {member && member.id && <FavoriteButton size="small" item={item} />}
      {enableEdition && (
        <>
          <EditButton item={item.toJS() as GraaspItem} />
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
      NameWrapper={NameWrapper({
        id,
        style: {
          textDecoration: 'none',
          color: 'inherit',
        },
      })}
    />
  );
};

export default Item;

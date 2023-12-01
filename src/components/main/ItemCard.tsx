import { CSSProperties, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import { DiscriminatedItem, ItemMembership, ItemType } from '@graasp/sdk';
import { Card as GraaspCard, Thumbnail } from '@graasp/ui';

import truncate from 'lodash.truncate';

import { DESCRIPTION_MAX_LENGTH } from '../../config/constants';
import { buildItemPath } from '../../config/paths';
import { hooks } from '../../config/queryClient';
import { buildItemCard, buildItemLink } from '../../config/selectors';
import defaultImage from '../../resources/avatar.png';
import { stripHtml } from '../../utils/item';
import { isItemUpdateAllowedForUser } from '../../utils/membership';
import EditButton from '../common/EditButton';
import FavoriteButton from '../common/FavoriteButton';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import BadgesCellRenderer, { ItemsStatuses } from '../table/BadgesCellRenderer';
import DownloadButton from './DownloadButton';
import ItemMenu from './ItemMenu';

const NameWrapper = ({ id, style }: { id: string; style: CSSProperties }) => {
  const NameComponent = ({
    children,
  }: PropsWithChildren<unknown>): JSX.Element => (
    <Link to={buildItemPath(id)} id={buildItemLink(id)} style={style}>
      {children}
    </Link>
  );
  return NameComponent;
};

type Props = {
  item: DiscriminatedItem;
  memberships?: ItemMembership[];
  itemsStatuses?: ItemsStatuses;
  canMove?: boolean;
};

const ItemComponent = ({
  item,
  memberships,
  itemsStatuses,
  canMove = true,
}: Props): JSX.Element => {
  const { id, name } = item;
  const { data: thumbnailUrl, isLoading } = hooks.useItemThumbnailUrl({ id });

  const alt = name;
  const defaultValueComponent = (
    <img
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
      src={defaultImage}
      alt={alt}
    />
  );

  const linkUrl =
    item.type === ItemType.LINK
      ? item?.extra?.[ItemType.LINK]?.thumbnails?.[0]
      : undefined;

  const ThumbnailComponent = (
    <Thumbnail
      id={item.id}
      isLoading={isLoading}
      url={thumbnailUrl ?? linkUrl}
      alt={alt}
      defaultComponent={defaultValueComponent}
    />
  );

  const { data: member } = useCurrentUserContext();
  const enableEdition = isItemUpdateAllowedForUser({
    memberships,
    memberId: member?.id,
  });

  const Actions = (
    <>
      {enableEdition && <EditButton item={item} />}
      {((member && member.id) || itemsStatuses?.[item.id]?.isPublic) && (
        <DownloadButton id={item.id} name={item.name} />
      )}
      {member && member.id && <FavoriteButton size="medium" item={item} />}
    </>
  );
  // here we use the same component as the table this is why it is instantiated a bit weirdly
  const Badges = BadgesCellRenderer({ itemsStatuses });

  return (
    <GraaspCard
      description={truncate(stripHtml(item.description || ''), {
        length: DESCRIPTION_MAX_LENGTH,
      })}
      Actions={Actions}
      Badges={<Badges data={item} />}
      name={item.name}
      creator={item.creator?.name}
      ItemMenu={
        <ItemMenu item={item} canEdit={enableEdition} canMove={canMove} />
      }
      Thumbnail={ThumbnailComponent}
      cardId={buildItemCard(item.id)}
      NameWrapper={NameWrapper({
        id: item.id,
        style: {
          textDecoration: 'none',
          color: 'inherit',
        },
      })}
    />
  );
};

export default ItemComponent;

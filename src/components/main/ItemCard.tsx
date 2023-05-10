import { List } from 'immutable';
import truncate from 'lodash.truncate';

import { CSSProperties, FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import { Item, ItemType } from '@graasp/sdk';
import { ItemMembershipRecord, ItemRecord } from '@graasp/sdk/frontend';
import { Card as GraaspCard, Thumbnail } from '@graasp/ui';

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

const NameWrapper = ({
  id,
  style,
}: {
  id: string;
  style: CSSProperties;
}): FC => {
  const NameComponent: FC<PropsWithChildren<unknown>> = ({ children }) => (
    <Link to={buildItemPath(id)} id={buildItemLink(id)} style={style}>
      {children}
    </Link>
  );
  return NameComponent;
};

type Props = {
  item: ItemRecord;
  memberships: List<ItemMembershipRecord>;
  itemsStatuses?: ItemsStatuses;
};

const ItemComponent: FC<Props> = ({ item, memberships, itemsStatuses }) => {
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
      ? item?.extra?.[ItemType.LINK]?.thumbnails?.first()
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

  // We need to convert the Record<item> (immutable) to item (object)
  // because the following components are shared between the Grid and Table views
  const Actions = (
    <>
      {member && member.id && <FavoriteButton size="medium" item={item} />}
      {enableEdition && (
        <>
          <EditButton
            item={
              // DO NOT REMOVE cast
              // here we cast explicitly to be equivalent to the grid which does not let us use Records
              item.toJS() as Item
            }
          />
          <DownloadButton id={item.id} name={item.name} />
        </>
      )}
    </>
  );
  // here we use the same component as the table this is why it is instantiated a bit weirdly
  const Badges = BadgesCellRenderer({ itemsStatuses });

  return (
    <GraaspCard
      description={truncate(stripHtml(item.description), {
        length: DESCRIPTION_MAX_LENGTH,
      })}
      Actions={Actions}
      Badges={<Badges data={item} />}
      name={item.name}
      creator={member?.name}
      ItemMenu={<ItemMenu item={item.toJS() as Item} canEdit={enableEdition} />}
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

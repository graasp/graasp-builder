import { List } from 'immutable';
import truncate from 'lodash.truncate';

import { CSSProperties, FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';
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
};

const ItemComponent: FC<Props> = ({ item, memberships }) => {
  const { id, name, description } = item;
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
              item.toJS() as DiscriminatedItem
            }
          />
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
      ItemMenu={
        <ItemMenu
          item={item.toJS() as DiscriminatedItem}
          canEdit={enableEdition}
        />
      }
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

export default ItemComponent;

import {
  DiscriminatedItem,
  ItemType,
  getLinkExtra,
  getMimetype,
} from '@graasp/sdk';
import { ItemIcon, Thumbnail } from '@graasp/ui';

import { hooks } from '../../config/queryClient';

const ItemThumbnail = ({
  data: item,
}: {
  data: DiscriminatedItem;
}): JSX.Element => {
  const linkExtra =
    item.type === ItemType.LINK ? getLinkExtra(item.extra) : undefined;

  const alt = item.name;
  const iconSrc = linkExtra?.icons?.[0];
  const thumbnailSrc = linkExtra?.thumbnails?.[0];
  const defaultValueComponent = (
    <ItemIcon
      type={item.type}
      iconSrc={iconSrc}
      alt={alt}
      mimetype={getMimetype(item.extra)}
    />
  );

  const { data: thumbnailUrl, isLoading } = hooks.useItemThumbnailUrl({
    id: item.id,
  });

  return (
    <Thumbnail
      url={thumbnailUrl ?? thumbnailSrc}
      maxWidth={30}
      maxHeight={30}
      alt={alt}
      isLoading={isLoading}
      defaultComponent={defaultValueComponent}
    />
  );
};

export default ItemThumbnail;

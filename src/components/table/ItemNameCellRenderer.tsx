import { Box, Typography } from '@mui/material';

import {
  DiscriminatedItem,
  ItemType,
  getEmbeddedLinkExtra,
  getMimetype,
} from '@graasp/sdk';
import { ItemIcon, Thumbnail } from '@graasp/ui';

import { hooks } from '../../config/queryClient';
import { buildNameCellRendererId } from '../../config/selectors';

type ChildProps = { data: DiscriminatedItem };

const ItemNameCellRenderer = (
  showThumbnails: boolean,
): ((props: ChildProps) => JSX.Element) => {
  const Component = ({ data: item }: ChildProps): JSX.Element => {
    const linkExtra =
      item.type === ItemType.LINK
        ? getEmbeddedLinkExtra(item.extra)
        : undefined;

    const alt = item.name;
    const iconSrc = linkExtra?.icons?.[0];
    const thumbnailSrc = linkExtra?.thumbnails?.[0];
    const defaultValueComponent = (
      <ItemIcon
        type={item.type}
        iconSrc={iconSrc}
        alt={alt}
        mimetype={getMimetype(item.extra)}
        sx={{ border: '2px solid red' }}
      />
    );

    const { data: thumbnailUrl, isLoading } = hooks.useItemThumbnailUrl({
      id: item.id,
    });

    return (
      <Box
        display="flex"
        alignItems="center"
        id={buildNameCellRendererId(item.id)}
      >
        {showThumbnails && (
          <Thumbnail
            url={thumbnailUrl ?? thumbnailSrc}
            maxWidth={30}
            maxHeight={30}
            alt={alt}
            isLoading={isLoading}
            defaultComponent={defaultValueComponent}
          />
        )}
        <Typography noWrap ml={1}>
          {item.name}
        </Typography>
      </Box>
    );
  };

  return Component;
};

export default ItemNameCellRenderer;

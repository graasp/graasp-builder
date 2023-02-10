import { Box, Typography } from '@mui/material';

import { ItemRecord } from '@graasp/sdk/frontend';
import { ItemIcon, Thumbnail } from '@graasp/ui';

import { hooks } from '../../config/queryClient';
import { buildNameCellRendererId } from '../../config/selectors';
import { getEmbeddedLinkExtra } from '../../utils/itemExtra';

type ChildProps = { data: ItemRecord };

const ItemNameCellRenderer = (
  showThumbnails: boolean,
): ((props: ChildProps) => JSX.Element) => {
  const Component = ({ data: item }: ChildProps): JSX.Element => {
    // TODO: improve types
    const linkExtra = getEmbeddedLinkExtra(item.extra as any);

    const alt = item.name;
    const defaultValueComponent = (
      <ItemIcon
        type={item.type}
        iconSrc={linkExtra?.icons?.[0]}
        alt={item.name}
      />
    );

    return (
      <Box
        display="flex"
        alignItems="center"
        id={buildNameCellRendererId(item.id)}
      >
        {showThumbnails && (
          <Thumbnail
            id={item.id}
            thumbnailSrc={linkExtra?.thumbnails?.[0]}
            maxWidth={30}
            maxHeight={30}
            alt={alt}
            defaultValue={defaultValueComponent}
            useThumbnail={hooks.useItemThumbnail as any}
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

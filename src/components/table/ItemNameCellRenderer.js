import PropTypes from 'prop-types';

import { Box, Typography } from '@mui/material';

import { ItemIcon, Thumbnail } from '@graasp/ui';

import { hooks } from '../../config/queryClient';
import { buildNameCellRendererId } from '../../config/selectors';
import { getEmbeddedLinkExtra } from '../../utils/itemExtra';

const ItemNameCellRenderer = (showThumbnails) => {
  const Component = ({ data: item }) => {
    const alt = item.name;
    const defaultValueComponent = (
      <ItemIcon
        type={item.type}
        id={item.id}
        iconSrc={getEmbeddedLinkExtra(item.extra)?.icons?.[0]}
        name={item.name}
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
            thumbnailSrc={getEmbeddedLinkExtra(item.extra)?.thumbnails?.[0]}
            maxWidth={30}
            maxHeight={30}
            alt={alt}
            defaultValue={defaultValueComponent}
            useThumbnail={hooks.useItemThumbnail}
          />
        )}
        <Typography noWrap ml={1}>
          {item.name}
        </Typography>
      </Box>
    );
  };

  Component.propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      extra: PropTypes.shape({}).isRequired,
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  };

  return Component;
};

export default ItemNameCellRenderer;

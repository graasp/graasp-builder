import { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';

import { Thumbnail } from '@graasp/ui';

import {
  ITEM_THUMBNAIL_CONTAINER_ID,
  ITEM_THUMBNAIL_DELETE_BTN_ID,
} from '@/config/selectors';

import {
  THUMBNAIL_SETTING_MAX_HEIGHT,
  THUMBNAIL_SETTING_MAX_WIDTH,
} from '../../../config/constants';

type Props = {
  itemId: string;
  isLoading: boolean;
  url?: string;
  alt: string;
  onDelete: () => void;
  hasThumbnail?: boolean;
};

const ThumbnailWithDeleteButton = ({
  itemId,
  isLoading,
  url,
  alt,
  onDelete,
  hasThumbnail,
}: Props): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false); // State to manage hover

  return (
    <Box
      sx={{
        position: 'relative',
        width: THUMBNAIL_SETTING_MAX_WIDTH,
        height: THUMBNAIL_SETTING_MAX_HEIGHT,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={ITEM_THUMBNAIL_CONTAINER_ID}
    >
      <Thumbnail
        id={itemId}
        isLoading={isLoading}
        url={url}
        alt={alt}
        maxWidth={THUMBNAIL_SETTING_MAX_WIDTH}
        maxHeight={THUMBNAIL_SETTING_MAX_HEIGHT}
      />
      {hasThumbnail && isHovered && (
        <IconButton
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            color: 'white',
            backgroundColor: grey[400],
            transition: 'opacity 0.3s ease',
            '&:hover': {
              backgroundColor: grey[800],
            },
          }}
          onClick={onDelete}
          id={ITEM_THUMBNAIL_DELETE_BTN_ID}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default ThumbnailWithDeleteButton;

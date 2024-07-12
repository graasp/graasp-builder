import { Box, Stack } from '@mui/material';

import { PackedItem } from '@graasp/sdk';
import type { DroppedFile } from '@graasp/ui';

import { useBuilderTranslation } from '@/config/i18n';
import { ItemLayoutMode } from '@/enums';
import { BUILDER } from '@/langs/constants';

import { useLayoutContext } from '../context/LayoutContext';
import Badges, { ItemsStatuses } from '../table/Badges';
import ItemActions from '../table/ItemActions';
import ItemCard from '../table/ItemCard';
import ItemMenuContent from './ItemMenuContent';

type Props = {
  item: PackedItem | DroppedFile;
  isDragging: boolean;
  isOver: boolean;
  isMovable: boolean;
  showThumbnails: boolean;
  itemsStatuses: ItemsStatuses;
  enableMoveInBetween: boolean;
};

const ItemsTableCard = ({
  item,
  isDragging,
  isOver,
  isMovable,
  showThumbnails,
  itemsStatuses,
  enableMoveInBetween,
}: Props): JSX.Element => {
  const { mode } = useLayoutContext();

  const { t: translateBuilder } = useBuilderTranslation();

  const dense = mode === ItemLayoutMode.List;

  if ('files' in item) {
    return (
      <Box
        sx={{
          boxSizing: 'border-box',
          border: '2px dashed grey',
        }}
      >
        {translateBuilder(BUILDER.UPLOAD_BETWEEN_FILES)}
      </Box>
    );
  }

  return (
    <Box px={1}>
      <ItemCard
        dense={dense}
        item={item}
        isOver={isOver}
        disabled={!isMovable && enableMoveInBetween}
        isDragging={isDragging}
        showThumbnail={showThumbnails}
        menu={<ItemMenuContent item={item} />}
        footer={
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Badges itemsStatuses={itemsStatuses} data={item} />
            <ItemActions data={item} />
          </Stack>
        }
      />
    </Box>
  );
};

export default ItemsTableCard;

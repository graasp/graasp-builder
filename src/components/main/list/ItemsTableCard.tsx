import { Box, Stack } from '@mui/material';

import { PackedItem } from '@graasp/sdk';
import type { DroppedFile } from '@graasp/ui';

import SmallUploadFile from '@/components/file/SmallUploadFile';
import { useBuilderTranslation } from '@/config/i18n';
import { ItemLayoutMode } from '@/enums';
import { BUILDER } from '@/langs/constants';

import { useLayoutContext } from '../../context/LayoutContext';
import Badges, { ItemsStatuses } from '../../table/Badges';
import ItemActions from '../../table/ItemActions';
import ItemCard from '../../table/ItemCard';
import ItemMenuContent from '../ItemMenuContent';

type Props = {
  item: PackedItem | DroppedFile;
  isDragging: boolean;
  isOver: boolean;
  isMovable: boolean;
  showThumbnails: boolean;
  itemsStatuses: ItemsStatuses;
  enableMoveInBetween: boolean;
  onClick?: (id: string) => void;
  isSelected?: boolean;
  onThumbnailClick?: () => void;
};

const ItemsTableCard = ({
  item,
  isDragging,
  isOver,
  isMovable,
  showThumbnails,
  itemsStatuses,
  enableMoveInBetween,
  onClick,
  isSelected,
  onThumbnailClick,
}: Props): JSX.Element => {
  const { mode } = useLayoutContext();

  const { t: translateBuilder } = useBuilderTranslation();

  const dense = mode === ItemLayoutMode.List;

  if ('files' in item) {
    return (
      <SmallUploadFile text={translateBuilder(BUILDER.UPLOAD_BETWEEN_FILES)} />
    );
  }

  return (
    <Box px={1} onClick={() => onClick?.(item.id)}>
      <ItemCard
        onThumbnailClick={onThumbnailClick}
        dense={dense}
        item={item}
        isOver={isOver}
        disabled={!isMovable && enableMoveInBetween}
        isDragging={isDragging}
        isSelected={isSelected}
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

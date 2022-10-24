import { FC } from 'react';

import {
  ITEMS_TABLE_COPY_SELECTED_ITEMS_ID,
  ITEMS_TABLE_MOVE_SELECTED_ITEMS_ID,
  ITEMS_TABLE_RECYCLE_SELECTED_ITEMS_ID,
} from '../../config/selectors';
import MoveButton from '../common/MoveButton';
import RecycleButton from '../common/RecycleButton';
import CopyButton from './CopyButton';

type Props = {
  selectedIds: string[];
};

const ItemActionsRenderer: FC<Props> = ({ selectedIds }) => (
  <>
    <MoveButton
      id={ITEMS_TABLE_MOVE_SELECTED_ITEMS_ID}
      color="primary"
      itemIds={selectedIds}
    />
    <CopyButton
      id={ITEMS_TABLE_COPY_SELECTED_ITEMS_ID}
      color="primary"
      itemIds={selectedIds}
    />
    <RecycleButton
      id={ITEMS_TABLE_RECYCLE_SELECTED_ITEMS_ID}
      color="primary"
      itemIds={selectedIds}
    />
  </>
);

export default ItemActionsRenderer;

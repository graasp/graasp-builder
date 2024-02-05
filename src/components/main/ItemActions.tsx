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
// todo: not used anymore ?
const ItemActionsRenderer = ({ selectedIds }: Props): JSX.Element => (
  <>
    <MoveButton
      id={ITEMS_TABLE_MOVE_SELECTED_ITEMS_ID}
      color="secondary"
      itemIds={selectedIds}
    />
    <CopyButton
      id={ITEMS_TABLE_COPY_SELECTED_ITEMS_ID}
      color="secondary"
      itemIds={selectedIds}
    />
    <RecycleButton
      id={ITEMS_TABLE_RECYCLE_SELECTED_ITEMS_ID}
      color="secondary"
      itemIds={selectedIds}
    />
  </>
);

export default ItemActionsRenderer;

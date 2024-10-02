import { DiscriminatedItem } from '@graasp/sdk';

import DeleteButton from '@/components/common/DeleteButton';
import RestoreButton from '@/components/common/RestoreButton';
import { useSelectionContext } from '@/components/main/list/SelectionContext';
import SelectionToolbar from '@/components/main/list/SelectionToolbar';
import {
  RECYCLE_BIN_DELETE_MANY_ITEMS_BUTTON_ID,
  RECYCLE_BIN_RESTORE_MANY_ITEMS_BUTTON_ID,
} from '@/config/selectors';

const RecycleBinSelectionToolbar = ({
  items,
}: {
  items: DiscriminatedItem[];
}): JSX.Element => {
  const { selectedIds, clearSelection } = useSelectionContext();

  return (
    <SelectionToolbar>
      <>
        <RestoreButton
          id={RECYCLE_BIN_RESTORE_MANY_ITEMS_BUTTON_ID}
          itemIds={selectedIds}
          onClick={clearSelection}
        />
        <DeleteButton
          id={RECYCLE_BIN_DELETE_MANY_ITEMS_BUTTON_ID}
          items={items.filter(({ id }) => selectedIds.includes(id))}
          onConfirm={clearSelection}
        />
      </>
    </SelectionToolbar>
  );
};

export default RecycleBinSelectionToolbar;

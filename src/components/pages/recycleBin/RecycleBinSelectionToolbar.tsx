import { PackedItem } from '@graasp/sdk';

import DeleteButton from '@/components/common/DeleteButton';
import RestoreButton from '@/components/common/RestoreButton';
import { useSelectionContext } from '@/components/main/list/SelectionContext';
import SelectionToolbar from '@/components/main/list/SelectionToolbar';

const RecycleBinSelectionToolbar = ({
  items,
}: {
  items: PackedItem[];
}): JSX.Element => {
  const { selectedIds, clearSelection } = useSelectionContext();

  return (
    <SelectionToolbar>
      <>
        <RestoreButton itemIds={selectedIds} onClick={clearSelection} />
        <DeleteButton
          items={items.filter(({ id }) => selectedIds.includes(id))}
          onConfirm={clearSelection}
        />
      </>
    </SelectionToolbar>
  );
};

export default RecycleBinSelectionToolbar;

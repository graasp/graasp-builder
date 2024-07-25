import { PackedItem } from '@graasp/sdk';

import RecycleButton from '@/components/common/RecycleButton';
import useModalStatus from '@/components/hooks/useModalStatus';
import CopyButton from '@/components/item/copy/CopyButton';
import { CopyModal } from '@/components/item/copy/CopyModal';
import MoveButton from '@/components/item/move/MoveButton';
import { MoveModal } from '@/components/item/move/MoveModal';
import { useSelectionContext } from '@/components/main/list/SelectionContext';
import SelectionToolbar from '@/components/main/list/SelectionToolbar';

const FolderSelectionToolbar = ({
  items,
}: {
  items: PackedItem[];
}): JSX.Element => {
  const { selectedIds, clearSelection } = useSelectionContext();

  const {
    isOpen: isCopyModalOpen,
    openModal: openCopyModal,
    closeModal: closeCopyModal,
  } = useModalStatus();
  const {
    isOpen: isMoveModalOpen,
    openModal: openMoveModal,
    closeModal: closeMoveModal,
  } = useModalStatus();

  return (
    <>
      <CopyModal
        onClose={() => {
          closeCopyModal();
          clearSelection();
        }}
        open={isCopyModalOpen}
        itemIds={selectedIds}
      />
      <MoveModal
        onClose={() => {
          closeMoveModal();
          clearSelection();
        }}
        open={isMoveModalOpen}
        items={items?.filter(({ id }) => selectedIds.includes(id))}
      />
      <SelectionToolbar>
        <>
          <MoveButton onClick={openMoveModal} />
          <CopyButton onClick={openCopyModal} />
          <RecycleButton
            onClick={clearSelection}
            color="primary"
            itemIds={selectedIds}
          />
        </>
      </SelectionToolbar>
    </>
  );
};

export default FolderSelectionToolbar;

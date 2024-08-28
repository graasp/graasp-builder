import { DiscriminatedItem, ItemMembership } from '@graasp/sdk';

import useModalStatus from '@/components/hooks/useModalStatus';
import { useBuilderTranslation } from '@/config/i18n';
import { buildItemMembershipRowDeleteButtonId } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import DeleteItemMembershipDialog from './DeleteItemMembershipDialog';
import TableRowDeleteButton from './TableRowDeleteButton';

const DeleteItemMembershipButton = ({
  data,
  itemId,
}: {
  data: ItemMembership;
  itemId: DiscriminatedItem['id'];
}): JSX.Element => {
  const { isOpen, closeModal, openModal } = useModalStatus();
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <>
      <TableRowDeleteButton
        onClick={() => openModal()}
        id={buildItemMembershipRowDeleteButtonId(data.id)}
        tooltip={translateBuilder(
          BUILDER.ITEM_MEMBERSHIPS_TABLE_CANNOT_DELETE_PARENT_TOOLTIP,
        )}
      />
      <DeleteItemMembershipDialog
        open={isOpen}
        handleClose={closeModal}
        itemId={itemId}
        membershipToDelete={data}
      />
    </>
  );
};

export default DeleteItemMembershipButton;

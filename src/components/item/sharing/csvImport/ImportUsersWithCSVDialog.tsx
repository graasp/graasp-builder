import { Dialog } from '@mui/material';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import ImportUsersDialogContent, {
  DIALOG_ID_LABEL,
} from './ImportUsersDialogContent';

type ImportUsersWithCSVDialogProps = {
  item: DiscriminatedItem;
  handleCloseModal: () => void;
  open: boolean;
};

const ImportUsersWithCSVDialog = ({
  item,
  handleCloseModal,
  open,
}: ImportUsersWithCSVDialogProps): JSX.Element => (
  <Dialog
    scroll="paper"
    onClose={handleCloseModal}
    aria-labelledby={DIALOG_ID_LABEL}
    open={open}
  >
    <ImportUsersDialogContent
      item={item}
      isFolder={item.type === ItemType.FOLDER}
      handleClose={handleCloseModal}
    />
  </Dialog>
);
export default ImportUsersWithCSVDialog;

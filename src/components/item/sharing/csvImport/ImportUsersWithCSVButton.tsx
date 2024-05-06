import { useState } from 'react';

import { Dialog } from '@mui/material';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { useBuilderTranslation } from '@/config/i18n';
import { SHARE_ITEM_CSV_PARSER_BUTTON_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import ImportUsersDialogContent, {
  DIALOG_ID_LABEL,
} from './ImportUsersDialogContent';

type ImportUsersWithCSVButtonProps = {
  item: DiscriminatedItem;
};

const ImportUsersWithCSVButton = ({
  item,
}: ImportUsersWithCSVButtonProps): JSX.Element => {
  const { t } = useBuilderTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Button
        id={SHARE_ITEM_CSV_PARSER_BUTTON_ID}
        onClick={handleOpenModal}
        variant="outlined"
        size="small"
      >
        {t(BUILDER.SHARE_ITEM_CSV_IMPORT_BUTTON)}
      </Button>
      <Dialog
        scroll="paper"
        onClose={handleCloseModal}
        aria-labelledby={DIALOG_ID_LABEL}
        open={modalOpen}
      >
        <ImportUsersDialogContent
          item={item}
          isFolder={item.type === ItemType.FOLDER}
          handleClose={handleCloseModal}
        />
      </Dialog>
    </>
  );
};
export default ImportUsersWithCSVButton;

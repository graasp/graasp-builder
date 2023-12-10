import { useState } from 'react';

import FolderCopy from '@mui/icons-material/FolderCopy';
import { Button, DialogContentText, Typography } from '@mui/material';

import { hooks } from '@/config/queryClient';
import { computeButtonText } from '@/utils/itemSelection';

import { useBuilderTranslation } from '../../../../config/i18n';
import { SELECT_TEMPLATE_FOLDER } from '../../../../config/selectors';
import { BUILDER } from '../../../../langs/constants';
import ItemSelectionModal, {
  ItemSelectionModalProps,
} from '../../../main/itemSelectionModal/ItemSelectionModal';

export type Props = {
  targetItemId: string;
  selectedItemId: string | undefined;
  onTemplateSelected: (itemId: string) => void;
};

const TemplateSelectionButton = ({
  targetItemId,
  selectedItemId,
  onTemplateSelected,
}: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { data: selectedItem } = hooks.useItem(selectedItemId);
  const [open, setOpen] = useState<boolean>(false);

  const openTemplateSelectionModal = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onConfirm: ItemSelectionModalProps['onConfirm'] = (
    newSelectedItemId,
  ) => {
    if (newSelectedItemId) {
      onTemplateSelected(newSelectedItemId);
    }
    onClose();
  };

  const buttonText = (name?: string) =>
    computeButtonText({
      translateBuilder: t,
      translateKey: BUILDER.ITEM_TEMPLATE_SELECTION_BUTTON,
      name,
    });

  return (
    <>
      <DialogContentText>
        {t(BUILDER.SHARE_ITEM_CSV_IMPORT_MODAL_CONTENT_GROUP_COLUMN_DETECTED)}
      </DialogContentText>
      <Button
        variant="outlined"
        id={SELECT_TEMPLATE_FOLDER}
        startIcon={<FolderCopy />}
        component="label"
        onClick={openTemplateSelectionModal}
      >
        {t(BUILDER.SELECT_TEMPLATE_INPUT_BUTTON)}
      </Button>
      {selectedItem?.name && (
        <Typography variant="caption">
          {t(BUILDER.SHARE_ITEM_CSV_IMPORT_SELECTED_TEMPLATE_CAPTION, {
            itemName: selectedItem.name,
          })}
        </Typography>
      )}

      {targetItemId && open && (
        <ItemSelectionModal
          titleKey={BUILDER.ITEM_TEMPLATE_SELECTION_MODAL_TITLE}
          buttonText={buttonText}
          onClose={onClose}
          open={open}
          onConfirm={onConfirm}
          itemIds={[targetItemId]}
        />
      )}
    </>
  );
};

export default TemplateSelectionButton;

import { useState } from 'react';

import { Button, DialogContentText, Typography } from '@mui/material';

import { FolderIcon } from 'lucide-react';

import { hooks } from '@/config/queryClient';
import { computeButtonText } from '@/utils/itemSelection';

import { useBuilderTranslation } from '../../../../config/i18n';
import {
  SHARE_CSV_TEMPLATE_SELECTION_BUTTON_ID,
  SHARE_CSV_TEMPLATE_SELECTION_DELETE_BUTTON_ID,
  SHARE_ITEM_FROM_CSV_WITH_GROUP_COLUMN_TEXT_ID,
} from '../../../../config/selectors';
import { BUILDER } from '../../../../langs/constants';
import ItemSelectionModal, {
  ItemSelectionModalProps,
} from '../../../main/itemSelectionModal/ItemSelectionModal';
import ChoiceDisplay from './ChoiceDisplay';

export type Props = {
  targetItemId: string;
  selectedItemId: string | undefined;
  onTemplateSelected: (itemId: string | undefined) => void;
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

  const handleDeleteTemplate = () => {
    onTemplateSelected(undefined);
  };

  const buttonText = (name?: string) =>
    computeButtonText({
      translateBuilder: t,
      translateKey: BUILDER.ITEM_TEMPLATE_SELECTION_BUTTON,
      name,
    });

  return (
    <>
      <DialogContentText id={SHARE_ITEM_FROM_CSV_WITH_GROUP_COLUMN_TEXT_ID}>
        {t(BUILDER.SHARE_ITEM_CSV_IMPORT_MODAL_CONTENT_GROUP_COLUMN_DETECTED)}
      </DialogContentText>

      {selectedItem ? (
        <>
          <ChoiceDisplay
            deleteButtonId={SHARE_CSV_TEMPLATE_SELECTION_DELETE_BUTTON_ID}
            onDelete={handleDeleteTemplate}
            name={selectedItem.name}
          />
          <DialogContentText>
            <Typography>
              {t(BUILDER.SHARE_ITEM_CSV_IMPORT_SELECTED_TEMPLATE_CAPTION)}
            </Typography>
          </DialogContentText>
        </>
      ) : (
        <Button
          id={SHARE_CSV_TEMPLATE_SELECTION_BUTTON_ID}
          variant="outlined"
          startIcon={<FolderIcon />}
          component="label"
          onClick={openTemplateSelectionModal}
        >
          {t(BUILDER.SELECT_TEMPLATE_INPUT_BUTTON)}
        </Button>
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

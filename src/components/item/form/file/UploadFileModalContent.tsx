import { DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import CancelButton from '@/components/common/CancelButton';
import FileUploader from '@/components/file/FileUploader';
import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import { EDIT_ITEM_MODAL_CANCEL_BUTTON_ID } from '../../../../config/selectors';

type UploadFileModalContentProps = {
  previousItemId?: DiscriminatedItem['id'];
  onClose: () => void;
};

export function UploadFileModalContent({
  previousItemId,
  onClose,
}: UploadFileModalContentProps): JSX.Element {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <>
      <DialogTitle>{translateBuilder(BUILDER.UPLOAD_FILE_TITLE)}</DialogTitle>
      <DialogContent>
        <FileUploader previousItemId={previousItemId} onComplete={onClose} />
      </DialogContent>
      <DialogActions>
        <CancelButton id={EDIT_ITEM_MODAL_CANCEL_BUTTON_ID} onClick={onClose} />
      </DialogActions>
    </>
  );
}

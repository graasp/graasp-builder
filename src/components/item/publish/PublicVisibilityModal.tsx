import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { PackedItem } from '@graasp/sdk';

import { SETTINGS } from '@/config/constants';
import { useBuilderTranslation } from '@/config/i18n';
import { PUBLIC_VISIBILITY_MODAL_VALIDATE_BUTTON } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import useVisibility from '../../hooks/useVisibility';

type Props = {
  item: PackedItem;
  isOpen: boolean;
  // if set to false, the item will not be public after validating the modal.
  // this allows to set the item to public only after the validation on the backend side.
  shouldUpdateVisibility?: boolean;
  onClose: () => void;
  onValidate?: () => void;
};

export const PublicVisibilityModal = ({
  item,
  isOpen,
  shouldUpdateVisibility = true,
  onClose,
  onValidate,
}: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { updateVisibility } = useVisibility(item);

  const handleValidate = async () => {
    if (shouldUpdateVisibility) {
      await updateVisibility(SETTINGS.ITEM_PUBLIC.name);
    }
    onValidate?.();
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle>
        <Typography variant="h3">
          {t(BUILDER.PUBLIC_VISIBILITY_MODAL_TITLE)}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography>
          {t(BUILDER.PUBLIC_VISIBILITY_MODAL_DESCRIPTION)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {t(BUILDER.CANCEL_BUTTON)}
        </Button>
        <Button
          data-cy={PUBLIC_VISIBILITY_MODAL_VALIDATE_BUTTON}
          onClick={handleValidate}
          variant="contained"
        >
          {t(BUILDER.PUBLIC_VISIBILITY_MODAL_VALIDATE_BUTTON)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PublicVisibilityModal;

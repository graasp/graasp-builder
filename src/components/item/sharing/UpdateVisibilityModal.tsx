import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import {
  UPDATE_VISIBILITY_MODAL_CANCEL_BUTTON,
  UPDATE_VISIBILITY_MODAL_VALIDATE_BUTTON,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

export type Visibility = {
  name: string;
  value: string;
};

type Props = {
  isOpen: boolean;
  newVisibility?: Visibility;
  onClose: () => void;
  onValidate: (visibility: string) => void;
};

export const UpdateVisibilityModal = ({
  isOpen,
  newVisibility,
  onClose,
  onValidate,
}: Props): JSX.Element | null => {
  const { t } = useBuilderTranslation();

  if (!newVisibility) {
    return null;
  }

  const handleValidate = async () => {
    onValidate(newVisibility.value);
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle>
        <Typography variant="h3">
          {t(BUILDER.UPDATE_VISIBILITY_MODAL_TITLE)}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography>
          {t(BUILDER.UPDATE_VISIBILITY_MODAL_DESCRIPTION)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          data-cy={UPDATE_VISIBILITY_MODAL_CANCEL_BUTTON}
          onClick={onClose}
          variant="outlined"
        >
          {t(BUILDER.CANCEL_BUTTON)}
        </Button>
        <Button
          data-cy={UPDATE_VISIBILITY_MODAL_VALIDATE_BUTTON}
          onClick={handleValidate}
          variant="contained"
        >
          {t(BUILDER.UPDATE_VISIBILITY_MODAL_VALIDATE_BUTTON, {
            visibility: newVisibility.name,
          })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateVisibilityModal;

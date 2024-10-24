import { UseFormRegisterReturn } from 'react-hook-form';

import { IconButton, TextField } from '@mui/material';

import { XIcon } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import { ITEM_FORM_LINK_INPUT_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

type LinkUrlFieldProps = {
  onClear: () => void;
  form: UseFormRegisterReturn;
  showClearButton?: boolean;
  isValid: boolean;
};
const LinkUrlField = ({
  onClear,
  form,
  showClearButton = false,
  isValid,
}: LinkUrlFieldProps): JSX.Element => {
  const { t } = useBuilderTranslation();
  return (
    <TextField
      variant="standard"
      id={ITEM_FORM_LINK_INPUT_ID}
      autoFocus
      margin="dense"
      label={t(BUILDER.CREATE_ITEM_LINK_LABEL)}
      {...form}
      helperText={isValid ? '' : t(BUILDER.CREATE_ITEM_LINK_INVALID_LINK_ERROR)}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        endAdornment: (
          <IconButton
            onClick={onClear}
            sx={{
              visibility: showClearButton ? 'visible' : 'hidden',
            }}
          >
            <XIcon fontSize="20" />
          </IconButton>
        ),
      }}
      fullWidth
      required
    />
  );
};
export default LinkUrlField;

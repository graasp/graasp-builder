import { ChangeEvent } from 'react';

import { IconButton, TextField } from '@mui/material';

import { XIcon } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import { ITEM_FORM_LINK_INPUT_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

type LinkUrlFieldProps = {
  value: string;
  isValid: boolean;
  onClear: () => void;
  onChange: (newValue: string) => void;
};
const LinkUrlField = ({
  value,
  isValid,
  onClear,
  onChange,
}: LinkUrlFieldProps): JSX.Element => {
  const { t } = useBuilderTranslation();
  return (
    <TextField
      variant="standard"
      id={ITEM_FORM_LINK_INPUT_ID}
      error={!isValid}
      autoFocus
      margin="dense"
      label={t(BUILDER.CREATE_ITEM_LINK_LABEL)}
      value={value}
      onChange={({
        target: { value: newValue },
      }: ChangeEvent<HTMLInputElement>) => onChange(newValue)}
      helperText={isValid ? '' : t(BUILDER.CREATE_ITEM_LINK_INVALID_LINK_ERROR)}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        endAdornment: (
          <IconButton
            onClick={onClear}
            sx={{
              visibility: value ? 'visible' : 'hidden',
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

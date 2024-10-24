import { UseFormRegisterReturn } from 'react-hook-form';

import { IconButton, TextField } from '@mui/material';

import { Undo2Icon, XIcon } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

type LinkDescriptionFieldProps = {
  onRestore: () => void;
  onClear: () => void;
  showRestoreButton?: boolean;
  form: UseFormRegisterReturn;
  showClearButton?: boolean;
};
const LinkDescriptionField = ({
  form,
  onRestore,
  onClear,
  showRestoreButton,
  showClearButton,
}: LinkDescriptionFieldProps): JSX.Element => {
  const { t } = useBuilderTranslation();
  return (
    <TextField
      label={t(BUILDER.DESCRIPTION_LABEL)}
      variant="standard"
      InputLabelProps={{ shrink: true }}
      {...form}
      InputProps={{
        endAdornment: (
          <>
            <IconButton
              onClick={onRestore}
              sx={{
                visibility: showRestoreButton ? 'visible' : 'hidden',
              }}
            >
              <Undo2Icon size="20" />
            </IconButton>

            <IconButton
              onClick={onClear}
              sx={{
                visibility: showClearButton ? 'visible' : 'hidden',
              }}
            >
              <XIcon size="20" />
            </IconButton>
          </>
        ),
      }}
    />
  );
};
export default LinkDescriptionField;

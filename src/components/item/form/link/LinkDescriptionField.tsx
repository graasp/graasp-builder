import { ChangeEvent } from 'react';

import { IconButton, TextField } from '@mui/material';

import { Undo2Icon, XIcon } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

type LinkDescriptionFieldProps = {
  value: string | null | undefined;
  onChange: (newValue: string) => void;
  onRestore: () => void;
  onClear: () => void;
  showRestore: boolean;
};
const LinkDescriptionField = ({
  value,
  onChange,
  onRestore,
  onClear,
  showRestore,
}: LinkDescriptionFieldProps): JSX.Element => {
  const { t } = useBuilderTranslation();
  return (
    <TextField
      label={t(BUILDER.DESCRIPTION_LABEL)}
      variant="standard"
      InputLabelProps={{ shrink: true }}
      value={value}
      onChange={({
        target: { value: newValue },
      }: ChangeEvent<HTMLInputElement>) => onChange(newValue)}
      InputProps={{
        endAdornment: (
          <>
            <IconButton
              onClick={onRestore}
              sx={{
                visibility: showRestore ? 'visible' : 'hidden',
              }}
            >
              <Undo2Icon size="20" />
            </IconButton>

            <IconButton
              onClick={onClear}
              sx={{
                visibility: value ? 'visible' : 'hidden',
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

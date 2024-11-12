import { useFormContext } from 'react-hook-form';

import { IconButton, TextField } from '@mui/material';

import { XIcon } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import { ITEM_FORM_LINK_INPUT_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';
import { LINK_REGEX } from '@/utils/item';

const LinkUrlField = (): JSX.Element => {
  const {
    register,
    reset,
    getValues,
    formState: { errors },
  } = useFormContext<{ url: string }>();
  const { t } = useBuilderTranslation();
  return (
    <TextField
      variant="standard"
      id={ITEM_FORM_LINK_INPUT_ID}
      autoFocus
      margin="dense"
      label={t(BUILDER.CREATE_ITEM_LINK_LABEL)}
      slotProps={{
        inputLabel: { shrink: true },
        input: {
          endAdornment: (
            <IconButton
              onClick={() => reset({ url: '' })}
              sx={{
                visibility: getValues().url ? 'visible' : 'hidden',
              }}
            >
              <XIcon fontSize="20" />
            </IconButton>
          ),
        },
      }}
      fullWidth
      required
      error={Boolean(errors.url)}
      helperText={errors.url?.message}
      {...register('url', {
        pattern: {
          value: LINK_REGEX,
          message: t(BUILDER.LINK_INVALID_MESSAGE),
        },
      })}
    />
  );
};
export default LinkUrlField;

import { useFormContext } from 'react-hook-form';

import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, TextField } from '@mui/material';

import { ItemConstants } from '@graasp/sdk';
import { FAILURE_MESSAGES } from '@graasp/translations';

import { ITEM_NAME_MAX_LENGTH } from '@/config/constants';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_NAME_INPUT_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

export type ItemNameFieldProps = {
  required?: boolean;
  autoFocus?: boolean;
  showClearButton?: boolean;
};

export const ItemNameField = ({
  required,
  autoFocus = true,
  showClearButton,
}: ItemNameFieldProps): JSX.Element => {
  const {
    register,
    reset,
    formState: { errors },
  } = useFormContext<{ name: string }>();
  const { t: translateBuilder } = useBuilderTranslation();

  const handleClearClick = () => {
    reset({ name: '' });
  };
  return (
    <TextField
      variant="standard"
      autoFocus={autoFocus}
      id={ITEM_FORM_NAME_INPUT_ID}
      label={translateBuilder(BUILDER.CREATE_NEW_ITEM_NAME_LABEL)}
      required={required}
      // always shrink because setting name from defined app does not shrink automatically
      slotProps={{
        inputLabel: { shrink: true },
        input: {
          // add a clear icon button
          endAdornment: (
            <IconButton
              onClick={handleClearClick}
              sx={{ visibility: showClearButton ? 'visible' : 'hidden' }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        },
      }}
      // only take full width when on small screen size
      fullWidth
      sx={{ my: 1 }}
      error={Boolean(errors.name)}
      helperText={errors.name?.message}
      {...register('name', {
        required,
        pattern: {
          message: FAILURE_MESSAGES.INVALID_ITEM_NAME_PATTERN_ERROR,
          value: ItemConstants.ITEM_NAME_REGEX,
        },
        maxLength: {
          message: FAILURE_MESSAGES.INVALID_ITEM_NAME_MAX_LENGTH_ERROR,
          value: ITEM_NAME_MAX_LENGTH,
        },
      })}
    />
  );
};

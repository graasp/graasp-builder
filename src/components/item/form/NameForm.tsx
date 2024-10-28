import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, TextField } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_NAME_INPUT_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

export type NameFormProps = {
  /**
   * @deprecated use nameForm
   */
  item?: DiscriminatedItem;
  /**
   * @deprecated use nameForm
   */
  setChanges?: (payload: Partial<DiscriminatedItem>) => void;
} & {
  required?: boolean;
  /**
   * @deprecated use nameForm
   */
  name?: string;
  autoFocus?: boolean;
  nameForm: UseFormRegisterReturn;
  reset?: () => void;
  error?: FieldError;
  showClearButton?: boolean;
};

const NameForm = ({
  nameForm,
  required,
  autoFocus = true,
  reset,
  error,
  showClearButton,
}: NameFormProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleClearClick = () => {
    reset?.();
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
      error={Boolean(error)}
      helperText={error?.message}
      {...nameForm}
    />
  );
};

export default NameForm;

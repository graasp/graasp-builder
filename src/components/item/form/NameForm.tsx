import { ChangeEvent } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

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
  nameForm?: UseFormRegisterReturn;
  reset?: () => void;
};

const NameForm = ({
  nameForm,
  required,
  setChanges,
  name,
  autoFocus = true,
  reset,
}: NameFormProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleNameInput = (event: ChangeEvent<{ value: string }>) => {
    setChanges?.({ name: event.target.value, displayName: event.target.value });
  };

  const handleClearClick = () => {
    reset?.();
    setChanges?.({ name: '' });
  };

  return (
    <TextField
      variant="standard"
      autoFocus={autoFocus}
      id={ITEM_FORM_NAME_INPUT_ID}
      label={translateBuilder(BUILDER.CREATE_NEW_ITEM_NAME_LABEL)}
      required={required}
      // always shrink because setting name from defined app does not shrink automatically
      InputLabelProps={{ shrink: true }}
      // add a clear icon button
      InputProps={{
        endAdornment: (
          <IconButton
            onClick={handleClearClick}
            sx={{ visibility: name ? 'visible' : 'hidden' }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        ),
      }}
      // only take full width when on small screen size
      fullWidth
      sx={{ my: 1 }}
      // TODO: to remove when all components using NameForm move to react hook form
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      onChange={handleNameInput}
      value={name}
      {...(nameForm ?? {})}
    />
  );
};

export default NameForm;

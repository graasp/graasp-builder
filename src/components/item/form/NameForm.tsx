import { ChangeEvent } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, TextField } from '@mui/material';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_NAME_INPUT_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import type { EditModalContentPropType } from './EditModalWrapper';

export type NameFormProps = EditModalContentPropType & {
  required?: boolean;
  autoFocus?: boolean;
};

const NameForm = ({
  item,
  required,
  updatedProperties,
  setChanges,
  autoFocus = true,
}: NameFormProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleNameInput = (event: ChangeEvent<{ value: string }>) => {
    setChanges({ name: event.target.value, displayName: event.target.value });
  };

  const handleClearClick = () => {
    setChanges({ name: '' });
  };

  return (
    <TextField
      variant="standard"
      autoFocus={autoFocus}
      id={ITEM_FORM_NAME_INPUT_ID}
      label={translateBuilder(BUILDER.CREATE_NEW_ITEM_NAME_LABEL)}
      required={required}
      value={updatedProperties?.name ?? item?.name ?? ''}
      onChange={handleNameInput}
      // always shrink because setting name from defined app does not shrink automatically
      InputLabelProps={{ shrink: true }}
      // add a clear icon button
      InputProps={{
        endAdornment: (
          <IconButton
            onClick={handleClearClick}
            sx={{ visibility: updatedProperties?.name ? 'visible' : 'hidden' }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        ),
      }}
      // only take full width when on small screen size
      fullWidth
      sx={{ my: 1 }}
    />
  );
};

export default NameForm;

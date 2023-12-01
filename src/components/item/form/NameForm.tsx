import { ChangeEvent } from 'react';

import { TextField, useMediaQuery, useTheme } from '@mui/material';

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
  const theme = useTheme();
  // when the screen is large, us only half of the width for the input.
  const largeScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const handleNameInput = (event: ChangeEvent<{ value: string }>) => {
    setChanges({ name: event.target.value });
  };

  return (
    <TextField
      variant="standard"
      autoFocus={autoFocus}
      required={required}
      id={ITEM_FORM_NAME_INPUT_ID}
      label={translateBuilder(BUILDER.CREATE_NEW_ITEM_NAME_LABEL)}
      value={updatedProperties?.name ?? item?.name ?? ''}
      onChange={handleNameInput}
      // always shrink because setting name from defined app does not shrink automatically
      InputLabelProps={{ shrink: true }}
      // only take full width when on small screen size
      fullWidth={!largeScreen}
      sx={{ my: 1, width: largeScreen ? '50%' : undefined }}
    />
  );
};

export default NameForm;

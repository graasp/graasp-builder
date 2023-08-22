import { ChangeEvent } from 'react';

import { TextField } from '@mui/material';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_NAME_INPUT_ID } from '../../../config/selectors';
import type { EditModalContentPropType } from './EditModalWrapper';

export type NameFormProps = EditModalContentPropType & {
  required?: boolean;
};

const NameForm = ({
  item,
  required,
  updatedProperties,
  setChanges,
}: NameFormProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleNameInput = (event: ChangeEvent<{ value: string }>) => {
    setChanges({ name: event.target.value });
  };

  return (
    <TextField
      variant="standard"
      autoFocus
      required={required}
      id={ITEM_FORM_NAME_INPUT_ID}
      label={translateBuilder(BUILDER.CREATE_NEW_ITEM_NAME_LABEL)}
      value={updatedProperties?.name ?? item?.name}
      onChange={handleNameInput}
      // always shrink because setting name from defined app does not shrink automatically
      InputLabelProps={{ shrink: true }}
      sx={{ width: '50%', my: 1 }}
    />
  );
};

export default NameForm;

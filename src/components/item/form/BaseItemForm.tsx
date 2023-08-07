import { ChangeEvent } from 'react';

import { TextField } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_NAME_INPUT_ID } from '../../../config/selectors';

export type BaseFormProps = {
  updatedProperties: Partial<DiscriminatedItem>;
  onChange: (props: Partial<DiscriminatedItem>) => void;
  item?: Partial<ItemRecord>;
  required?: boolean;
};

const BaseForm = ({
  onChange,
  item,
  required,
  updatedProperties,
}: BaseFormProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleNameInput = (event: ChangeEvent<{ value: string }>) => {
    onChange({ ...updatedProperties, name: event.target.value });
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

export default BaseForm;

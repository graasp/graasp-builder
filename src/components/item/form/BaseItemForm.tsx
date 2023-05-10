import { TextField } from '@mui/material';

import { ChangeEvent, FC } from 'react';

import { DiscriminatedItem, UnknownExtra } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_NAME_INPUT_ID } from '../../../config/selectors';

type Props = {
  updatedProperties: Partial<DiscriminatedItem<UnknownExtra>>;
  onChange: (props: Partial<DiscriminatedItem>) => void;
  item: Partial<ItemRecord>;
  required?: boolean;
};

const BaseForm: FC<Props> = ({
  onChange,
  item,
  required,
  updatedProperties,
}) => {
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

import { TextField } from '@mui/material';

import { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Item } from '@graasp/sdk';

import { ITEM_FORM_NAME_INPUT_ID } from '../../../config/selectors';

type Props = {
  updatedProperties: Partial<Item>;
  onChange: (props: Partial<Item>) => void;
  item: Item;
};

const BaseForm: FC<Props> = ({ onChange, item, updatedProperties }) => {
  const { t } = useTranslation();

  const handleNameInput = (event: ChangeEvent<{ value: string }>) => {
    onChange({ ...updatedProperties, name: event.target.value });
  };

  return (
    <TextField
      variant="standard"
      autoFocus
      id={ITEM_FORM_NAME_INPUT_ID}
      label={t('Name')}
      value={updatedProperties?.name ?? item?.name}
      onChange={handleNameInput}
      // always shrink because setting name from defined app does not shrink automatically
      InputLabelProps={{ shrink: true }}
      sx={{ width: '50%', my: 1 }}
    />
  );
};

export default BaseForm;

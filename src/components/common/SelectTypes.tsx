import * as React from 'react';

import { Stack } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { ItemType } from '@graasp/sdk';
import { ItemIcon } from '@graasp/ui';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import { useFilterItemsContext } from '../context/FilterItemsContext';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { S3_FILE, ...BUILDER_ITEM_TYPES } = ItemType; // exclude S3 file

export const MultipleSelectCheckmarks = (): JSX.Element => {
  const { itemTypes, setItemTypes } = useFilterItemsContext();
  const { t: translateEnums } = useEnumsTranslation();
  const { t: translateBuilder } = useBuilderTranslation();

  const types = Object.values(BUILDER_ITEM_TYPES).sort((t1, t2) =>
    translateEnums(t1).localeCompare(translateEnums(t2)),
  );

  const handleChange = (event: SelectChangeEvent<typeof itemTypes>) => {
    const {
      target: { value },
    } = event;

    if (typeof value === typeof itemTypes) {
      setItemTypes(value as typeof itemTypes);
    } else {
      console.error('Something goes wrong with SelectTypes filter');
    }
  };

  const label = translateBuilder(BUILDER.FILTER_BY_TYPES_LABEL);

  const renderValues = (value: typeof itemTypes) => (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {value.map((type) => (
        <ItemIcon alt={type} type={type} />
      ))}
    </Stack>
  );

  return (
    <FormControl sx={{ maxWidth: 180 }} size="small">
      <InputLabel id="select-types-filter-label">{label}</InputLabel>
      <Select
        labelId="select-types-filter-label"
        id="select-types-filter"
        size="small"
        multiple
        value={itemTypes}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={renderValues}
        MenuProps={MenuProps}
      >
        {types.map((type) => (
          <MenuItem key={type} value={type}>
            <Checkbox checked={itemTypes.indexOf(type) > -1} />
            <Stack direction="row" spacing={1} alignItems="center">
              <ItemIcon alt={type} type={type} />
              <ListItemText primary={translateEnums(type)} />
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultipleSelectCheckmarks;

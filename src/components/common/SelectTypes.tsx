import * as React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { ItemType, UnionOfConst } from '@graasp/sdk';

import { ItemTypesFilterChanged } from '@/config/types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = Object.values(ItemType);

type Props = {
  onChange?: ItemTypesFilterChanged;
};

export const MultipleSelectCheckmarks = ({ onChange }: Props): JSX.Element => {
  const [itemTypes, setItemTypes] = React.useState<
    UnionOfConst<typeof ItemType>[]
  >([]);

  const handleChange = (event: SelectChangeEvent<typeof itemTypes>) => {
    const {
      target: { value },
    } = event;

    if (typeof value === typeof itemTypes) {
      onChange?.(value as typeof itemTypes);
      setItemTypes(value as typeof itemTypes);
    } else {
      console.error('Something goes wrong with SelectTypes filter');
    }
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={itemTypes}
          onChange={handleChange}
          input={<OutlinedInput label="Types" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={itemTypes.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultipleSelectCheckmarks;

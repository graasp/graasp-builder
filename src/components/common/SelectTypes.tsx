import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';

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

// Exclude LOCAL_FILE because it is also file like for S3_FILE but stored in another location.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { LOCAL_FILE, ...BUILDER_ITEM_TYPES } = ItemType;
const LABEL_ID = 'select-types-filter-label';

export const SelectTypes = (): JSX.Element => {
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
    setItemTypes(value as typeof itemTypes);
  };

  const label = translateBuilder(BUILDER.FILTER_BY_TYPES_LABEL);

  const renderValues = (value: typeof itemTypes) => (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {value.map((type) => (
        <ItemIcon key={type} alt={type} type={type} />
      ))}
    </Stack>
  );

  return (
    <FormControl sx={{ width: 'max-content', minWidth: '200px' }} size="small">
      <InputLabel id={LABEL_ID}>{label}</InputLabel>
      <Select
        labelId={LABEL_ID}
        size="small"
        multiple
        value={itemTypes}
        onChange={handleChange}
        input={
          <OutlinedInput
            label={label}
            inputProps={{ 'data-umami-event': 'filter-item-type' }}
          />
        }
        renderValue={renderValues}
        MenuProps={MenuProps}
        sx={{
          borderRadius: 40,
        }}
      >
        {types.map((type) => (
          <MenuItem key={type} value={type} disableGutters sx={{ padding: 0 }}>
            <Checkbox checked={itemTypes.includes(type)} size="small" />
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

export default SelectTypes;

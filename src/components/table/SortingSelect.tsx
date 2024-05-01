import { Dispatch } from 'react';

import {
  FormControl,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import { ArrowDownNarrowWide, ArrowUpWideNarrow } from 'lucide-react';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

// corresponds to the value that should be sent in the request
export enum SortingOptions {
  ItemName = 'item.name',
  ItemType = 'item.type',
  ItemCreator = 'item.creator.name',
  ItemUpdatedAt = 'item.updated_at',
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const LABEL_ID = 'sort-by-filter-label';

// TODO: desc asc

export type SortingSelectProps = {
  sortBy: SortingOptions;
  setSortBy: Dispatch<SortingOptions>;
  ordering: 'asc' | 'desc';
  setOrdering: Dispatch<'asc' | 'desc'>;
};

export const SortingSelect = ({
  sortBy = SortingOptions.ItemUpdatedAt,
  setSortBy,
  ordering,
  setOrdering,
}: SortingSelectProps): JSX.Element => {
  const { t: translateEnums } = useEnumsTranslation();
  const { t: translateBuilder } = useBuilderTranslation();

  const options = Object.values(SortingOptions).sort((t1, t2) =>
    translateEnums(t1).localeCompare(translateEnums(t2)),
  );

  const handleChange = (event: SelectChangeEvent<SortingOptions>) => {
    const {
      target: { value: v },
    } = event;
    setSortBy(v as SortingOptions);
  };

  const label = translateBuilder(BUILDER.SORT_BY_LABEL);

  return (
    <FormControl size="small">
      <FormGroup row>
        <InputLabel id={LABEL_ID}>{label}</InputLabel>
        <Select<SortingOptions>
          labelId={LABEL_ID}
          label={label}
          value={sortBy}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
          sx={{
            borderRadius: 40,
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option} dense>
              {translateBuilder(option)}
            </MenuItem>
          ))}
        </Select>
        <IconButton
          onClick={() => {
            setOrdering(ordering === 'asc' ? 'desc' : 'asc');
          }}
        >
          {ordering === 'asc' ? <ArrowDownNarrowWide /> : <ArrowUpWideNarrow />}
        </IconButton>
      </FormGroup>
    </FormControl>
  );
};

export default SortingSelect;

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

import { useBuilderTranslation } from '@/config/i18n';
import { SORTING_SELECT_SELECTOR_TEST_ID } from '@/config/selectors';
import { Ordering } from '@/enums';
import { BUILDER } from '@/langs/constants';

import { AllSortingOptions, SortingOptions } from './types';

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

export type SortingSelectProps<T extends AllSortingOptions = SortingOptions> = {
  sortBy: T;
  setSortBy: Dispatch<T>;
  ordering: Ordering;
  setOrdering: Dispatch<Ordering>;
  options: T[];
};

export const SortingSelect = <T extends AllSortingOptions = SortingOptions>({
  sortBy,
  setSortBy,
  ordering,
  setOrdering,
  options,
}: SortingSelectProps<T>): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value: v },
    } = event;
    setSortBy(v as T);
  };

  const label = translateBuilder(BUILDER.SORT_BY_LABEL);

  const sortedOptions = options
    .map((o) => [o, translateBuilder(o)])
    .sort((a, b) => (a[1] > b[1] ? 1 : -1));

  return (
    <FormControl size="small">
      <FormGroup row>
        <InputLabel id={LABEL_ID}>{label}</InputLabel>

        <Select
          data-testid={SORTING_SELECT_SELECTOR_TEST_ID}
          labelId={LABEL_ID}
          label={label}
          value={sortBy ?? SortingOptions.ItemUpdatedAt}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
          sx={{
            borderRadius: 40,
          }}
        >
          {sortedOptions.map(([option, title]) => (
            <MenuItem key={option} value={option} dense>
              {title}
            </MenuItem>
          ))}
        </Select>
        <IconButton
          onClick={() => {
            setOrdering(
              ordering === Ordering.ASC ? Ordering.DESC : Ordering.ASC,
            );
          }}
        >
          {ordering === Ordering.ASC ? (
            <ArrowDownNarrowWide />
          ) : (
            <ArrowUpWideNarrow />
          )}
        </IconButton>
      </FormGroup>
    </FormControl>
  );
};

export default SortingSelect;

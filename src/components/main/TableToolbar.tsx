import { Chip, Stack } from '@mui/material';

import { useBuilderTranslation } from '@/config/i18n';
import { ACCESSIBLE_ITEMS_ONLY_ME_ID } from '@/config/selectors';
import { ShowOnlyMeChangeType } from '@/config/types';

import { BUILDER } from '../../langs/constants';
import SelectTypes from '../common/SelectTypes';
import ModeButton from '../item/header/ModeButton';
import SortingSelect, { SortingSelectProps } from '../table/SortingSelect';

export type ItemsTableProps = {
  onShowOnlyMeChange?: ShowOnlyMeChangeType;
  showOnlyMe?: boolean;
  sortBy?: SortingSelectProps['sortBy'];
  setSortBy?: SortingSelectProps['setSortBy'];
  ordering: SortingSelectProps['ordering'];
  setOrdering: SortingSelectProps['setOrdering'];
};
const TableToolbar = ({
  showOnlyMe,
  onShowOnlyMeChange,
  sortBy,
  setSortBy,
  ordering,
  setOrdering,
}: ItemsTableProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <Stack
      alignItems="space-between"
      direction="column"
      mt={2}
      gap={1}
      width="100%"
    >
      <Stack spacing={1}>
        {onShowOnlyMeChange && (
          <Chip
            color="primary"
            onClick={() => {
              onShowOnlyMeChange(!showOnlyMe);
            }}
            variant={showOnlyMe ? 'filled' : 'outlined'}
            sx={{ fontSize: '1rem', maxWidth: 'max-content' }}
            id={ACCESSIBLE_ITEMS_ONLY_ME_ID}
            label={translateBuilder(BUILDER.HOME_SHOW_ONLY_CREATED_BY_ME)}
          />
        )}
      </Stack>
      <Stack
        spacing={1}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <SelectTypes />
        <Stack direction="row" gap={1}>
          {sortBy && setSortBy && (
            <SortingSelect
              sortBy={sortBy}
              setSortBy={setSortBy}
              ordering={ordering}
              setOrdering={setOrdering}
            />
          )}
          <ModeButton />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TableToolbar;

import { List, RecordOf } from 'immutable';

import Typography from '@mui/material/Typography';

import { ChangeEvent, FC, useState } from 'react';

import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { SearchInput } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  ITEMS_GRID_NO_SEARCH_RESULT_ID,
  ITEM_SEARCH_INPUT_ID,
} from '../../config/selectors';

export const NoItemSearchResult: FC = () => {
  const { t } = useBuilderTranslation();

  return (
    <Typography
      id={ITEMS_GRID_NO_SEARCH_RESULT_ID}
      variant="subtitle1"
      align="center"
      display="block"
    >
      {t(BUILDER.ITEM_SEARCH_NO_RESULTS_MESSAGE)}
    </Typography>
  );
};

export const useItemSearch = (
  items: List<RecordOf<Item>>,
): {
  results: List<RecordOf<Item>>;
  text: string;
  input: JSX.Element;
} => {
  const { t } = useBuilderTranslation();
  const [searchText, setSearchText] = useState<string>('');

  const handleSearchInput = (event: ChangeEvent<{ value: string }>) => {
    const text = event.target.value;
    setSearchText(text.toLowerCase());
  };

  const results = items?.filter((it) =>
    it?.name?.toLowerCase().includes(searchText),
  );

  const itemSearchInput = (
    <SearchInput
      key="searchInput"
      onChange={handleSearchInput}
      value={searchText}
      inputBaseId={ITEM_SEARCH_INPUT_ID}
      placeholder={t(BUILDER.ITEM_SEARCH_PLACEHOLDER)}
    />
  );
  return { results, text: searchText, input: itemSearchInput };
};
